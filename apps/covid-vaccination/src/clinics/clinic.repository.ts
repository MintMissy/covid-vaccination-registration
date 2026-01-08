import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IClinicRepository } from './interfaces/clinic-repository.interface';
import { Clinic, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  FindAllOptions,
} from '../app/interfaces/repository.interface';

@Injectable()
export class ClinicRepository implements IClinicRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ClinicCreateInput): Promise<Clinic> {
    return this.prisma.clinic.create({ data });
  }

  async findById(id: number): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({ where: { id } });
  }

  async findByIdWithDoctors(id: number): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({
      where: { id },
      include: { doctors: true },
    });
  }

  async findByIdWithAppointments(id: number): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({
      where: { id },
      include: { appointments: true },
    });
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedResult<Clinic>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.clinic.findMany({
        where: options?.where,
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.clinic.count({ where: options?.where }),
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

  async update(id: number, data: Prisma.ClinicUpdateInput): Promise<Clinic> {
    return this.prisma.clinic.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.clinic.delete({ where: { id } });
  }
}
