import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPatientRepository } from './interfaces/patient-repository.interface';
import { Patient, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  FindAllOptions,
} from '../app/interfaces/repository.interface';

@Injectable()
export class PatientRepository implements IPatientRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  async findByPesel(pesel: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { pesel } });
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedResult<Patient>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: options?.where,
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.patient.count({ where: options?.where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByCity(
    city: string,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Patient>> {
    return this.findAll({
      ...options,
      where: { ...options?.where, city },
    });
  }

  async findByIdWithAppointments(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            clinic: true,
            doctor: {
              include: {
                user: true,
              },
            },
            vaccination: {
              include: {
                vaccine: true,
              },
            },
          },
          orderBy: {
            appointmentDate: 'desc',
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.PatientUpdateInput): Promise<Patient> {
    return this.prisma.patient.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.delete({ where: { id } });
  }
}
