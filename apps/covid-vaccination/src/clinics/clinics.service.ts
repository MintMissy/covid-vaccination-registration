import { Injectable, NotFoundException } from '@nestjs/common';
import { ClinicRepository } from './clinic.repository';
import { AppointmentRepository } from '../appointments/appointment.repository';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClinicsService {
  constructor(
    private clinicRepository: ClinicRepository,
    private appointmentRepository: AppointmentRepository,
  ) {}

  async findAll() {
    const result = await this.clinicRepository.findAll();
    return result.data;
  }

  async findOne(id: number) {
    const clinic = await this.clinicRepository.findById(id);

    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return clinic;
  }

  async update(id: number, updateClinicDto: UpdateClinicDto) {
    await this.findOne(id);

    try {
      return await this.clinicRepository.update(id, updateClinicDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Clinic with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getAvailability(id: number, date: string) {
    const clinic = await this.findOne(id);

    const requestedDate = new Date(date);
    const dateStart = new Date(requestedDate);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(requestedDate);
    dateEnd.setHours(23, 59, 59, 999);

    const bookedAppointments = await this.appointmentRepository.findByDateRange(
      dateStart,
      dateEnd,
      id,
    );

    const bookedSlots = bookedAppointments.length;
    const totalSlots = clinic.capacityPerDay;
    const availableSlots = totalSlots - bookedSlots;

    // Generate available time slots (assuming 30-minute intervals from 9:00 to 17:00)
    const allSlots: string[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(timeString);
      }
    }

    // Filter out booked slots
    const bookedTimes = bookedAppointments.map((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      return `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`;
    });

    const availableTimeSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot),
    );

    return {
      clinicId: id,
      date: date,
      availableSlots: availableTimeSlots.slice(0, availableSlots),
      totalSlots,
      bookedSlots,
      availableSlotsCount: availableSlots,
    };
  }
}
