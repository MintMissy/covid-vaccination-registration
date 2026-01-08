import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { PatientRepository } from '../patients/patient.repository';
import { ClinicRepository } from '../clinics/clinic.repository';
import { DoctorRepository } from '../doctors/doctor.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { AppointmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private patientRepository: PatientRepository,
    private clinicRepository: ClinicRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDate = new Date(createAppointmentDto.appointmentDate);
    if (appointmentDate < new Date()) {
      throw new BadRequestException('Appointment date must be in the future');
    }

    const patient = await this.patientRepository.findById(
      createAppointmentDto.patientId,
    );

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const clinic = await this.clinicRepository.findById(
      createAppointmentDto.clinicId,
    );

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const appointmentsCount =
      await this.appointmentRepository.countByDateAndClinic(
        appointmentDate,
        createAppointmentDto.clinicId,
      );

    if (appointmentsCount >= clinic.capacityPerDay) {
      throw new BadRequestException('Clinic is at full capacity for this date');
    }

    //  Validate doctor if provided
    if (createAppointmentDto.doctorId) {
      const doctor = await this.doctorRepository.findById(
        createAppointmentDto.doctorId,
      );
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }
      if (doctor.clinicId !== createAppointmentDto.clinicId) {
        throw new BadRequestException('Doctor is not assigned to this clinic');
      }
    }

    if (createAppointmentDto.doseNumber < 1) {
      throw new BadRequestException('Dose number must be at least 1');
    }

    return await this.appointmentRepository.create({
      patient: { connect: { id: createAppointmentDto.patientId } },
      clinic: { connect: { id: createAppointmentDto.clinicId } },
      ...(createAppointmentDto.doctorId && {
        doctor: { connect: { id: createAppointmentDto.doctorId } },
      }),
      appointmentDate: appointmentDate,
      doseNumber: createAppointmentDto.doseNumber,
      notes: createAppointmentDto.notes,
      status: AppointmentStatus.SCHEDULED,
    });
  }

  async findAll(query: AppointmentQueryDto) {
    const where: Prisma.AppointmentWhereInput = {};

    if (query.patientId) {
      where.patientId = query.patientId;
    }

    if (query.clinicId) {
      where.clinicId = query.clinicId;
    }

    if (query.doctorId) {
      where.doctorId = query.doctorId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate || query.endDate) {
      where.appointmentDate = {};
      if (query.startDate) {
        where.appointmentDate.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const endDate = new Date(query.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.appointmentDate.lte = endDate;
      }
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy: Prisma.AppointmentOrderByWithRelationInput =
      sortBy === 'appointmentDate'
        ? { appointmentDate: sortOrder }
        : sortBy === 'status'
          ? { status: sortOrder }
          : { createdAt: sortOrder };

    return this.appointmentRepository.findAll({
      page: query.page,
      limit: query.limit,
      where,
      orderBy,
    });
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed appointment');
    }

    // If updating date, check clinic capacity
    if (updateAppointmentDto.appointmentDate) {
      const appointmentDate = new Date(updateAppointmentDto.appointmentDate);
      if (appointmentDate < new Date()) {
        throw new BadRequestException('Appointment date must be in the future');
      }

      const clinic = await this.clinicRepository.findById(appointment.clinicId);

      if (!clinic) {
        throw new NotFoundException('Clinic not found');
      }

      // Check capacity using repository
      // Note: We need to count excluding current appointment
      const appointmentsCount =
        await this.appointmentRepository.countByDateAndClinic(
          appointmentDate,
          appointment.clinicId,
        );

      // Adjust count if updating (exclude current appointment)
      const adjustedCount =
        appointment.appointmentDate.toDateString() ===
        appointmentDate.toDateString()
          ? appointmentsCount - 1
          : appointmentsCount;

      if (adjustedCount >= clinic.capacityPerDay) {
        throw new BadRequestException(
          'Clinic is at full capacity for this date',
        );
      }
    }

    try {
      return await this.appointmentRepository.update(id, {
        ...updateAppointmentDto,
        ...(updateAppointmentDto.appointmentDate && {
          appointmentDate: new Date(updateAppointmentDto.appointmentDate),
        }),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot delete completed appointment');
    }

    await this.appointmentRepository.delete(id);

    return { message: 'Appointment deleted successfully' };
  }

  async cancel(id: string) {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    return await this.appointmentRepository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });
  }
}
