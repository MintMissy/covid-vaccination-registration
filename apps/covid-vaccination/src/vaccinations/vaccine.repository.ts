import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IVaccineRepository } from './interfaces/vaccine-repository.interface';
import { Vaccine, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  FindAllOptions,
} from '../app/interfaces/repository.interface';

@Injectable()
export class VaccineRepository implements IVaccineRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VaccineCreateInput): Promise<Vaccine> {
    return this.prisma.vaccine.create({ data });
  }

  async findById(id: string | number): Promise<Vaccine | null> {
    return this.prisma.vaccine.findUnique({ where: { id: Number(id) } });
  }

  async findByBatchNumber(batchNumber: string): Promise<Vaccine | null> {
    return this.prisma.vaccine.findUnique({ where: { batchNumber } });
  }

  async findNonExpired(): Promise<Vaccine[]> {
    return this.prisma.vaccine.findMany({
      where: {
        expiryDate: {
          gte: new Date(),
        },
      },
    });
  }

  async findAll(options?: FindAllOptions): Promise<PaginatedResult<Vaccine>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vaccine.findMany({
        where: options?.where,
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.vaccine.count({ where: options?.where }),
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
    data: Prisma.VaccineUpdateInput,
  ): Promise<Vaccine> {
    return this.prisma.vaccine.update({
      where: { id: Number(id) },
      data,
    });
  }

  async delete(id: string | number): Promise<void> {
    await this.prisma.vaccine.delete({ where: { id: Number(id) } });
  }
}
