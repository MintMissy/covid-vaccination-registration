import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VaccineRepository } from './vaccine.repository';
import { DoctorRepository } from '../doctors/doctor.repository';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { AppointmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class VaccinationsService {
  constructor(
    private prisma: PrismaService,
    private vaccineRepository: VaccineRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async create(createVaccinationDto: CreateVaccinationDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createVaccinationDto.appointmentId },
      include: {
        vaccination: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (
      appointment.status !== AppointmentStatus.SCHEDULED &&
      appointment.status !== AppointmentStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Appointment must be in SCHEDULED or COMPLETED status',
      );
    }

    if (appointment.vaccination) {
      throw new BadRequestException(
        'Vaccination record already exists for this appointment',
      );
    }

    const vaccine = await this.vaccineRepository.findById(
      createVaccinationDto.vaccineId,
    );

    if (!vaccine) {
      throw new NotFoundException('Vaccine not found');
    }

    const administeredDate = new Date(createVaccinationDto.administeredAt);
    if (administeredDate > vaccine.expiryDate) {
      throw new BadRequestException('Vaccine has expired');
    }

    const doctor = await this.doctorRepository.findById(
      createVaccinationDto.doctorId,
    );

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.clinicId !== appointment.clinicId) {
      throw new BadRequestException(
        'Doctor is not assigned to the clinic of this appointment',
      );
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const vaccination = await tx.vaccination.create({
          data: {
            appointmentId: createVaccinationDto.appointmentId,
            vaccineId: createVaccinationDto.vaccineId,
            doctorId: createVaccinationDto.doctorId,
            administeredAt: administeredDate,
            nextDoseDate: createVaccinationDto.nextDoseDate
              ? new Date(createVaccinationDto.nextDoseDate)
              : null,
            sideEffects: createVaccinationDto.sideEffects,
          },
          include: {
            appointment: {
              include: {
                patient: true,
                clinic: true,
              },
            },
            vaccine: true,
            doctor: {
              include: {
                user: true,
              },
            },
          },
        });

        await tx.appointment.update({
          where: { id: createVaccinationDto.appointmentId },
          data: {
            status: AppointmentStatus.COMPLETED,
          },
        });

        return vaccination;
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Vaccination record already exists for this appointment',
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.vaccination.findMany({
      include: {
        appointment: {
          include: {
            patient: true,
            clinic: true,
          },
        },
        vaccine: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        administeredAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const vaccination = await this.prisma.vaccination.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: true,
            clinic: true,
          },
        },
        vaccine: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!vaccination) {
      throw new NotFoundException(`Vaccination with ID ${id} not found`);
    }

    return vaccination;
  }
}
