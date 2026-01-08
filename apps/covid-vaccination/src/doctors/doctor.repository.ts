import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IDoctorRepository } from './interfaces/doctor-repository.interface';
import { Doctor, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  FindAllOptions,
} from '../app/interfaces/repository.interface';

@Injectable()
export class DoctorRepository implements IDoctorRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DoctorCreateInput): Promise<Doctor> {
    return this.prisma.doctor.create({ data });
  }

  async findById(id: string | number): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { id: String(id) } });
  }

  async findByClinicId(clinicId: number): Promise<Doctor[]> {
    return this.prisma.doctor.findMany({
      where: { clinicId },
    });
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { licenseNumber } });
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { userId } });
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedResult<Doctor>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where: options?.where,
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: true,
          clinic: true,
        },
      }),
      this.prisma.doctor.count({ where: options?.where }),
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

  async update(
    id: string | number,
    data: Prisma.DoctorUpdateInput,
  ): Promise<Doctor> {
    return this.prisma.doctor.update({
      where: { id: String(id) },
      data,
    });
  }

  async delete(id: string | number): Promise<void> {
    await this.prisma.doctor.delete({ where: { id: String(id) } });
  }
}
