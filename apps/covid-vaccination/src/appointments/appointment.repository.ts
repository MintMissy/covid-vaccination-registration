import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAppointmentRepository } from './interfaces/appointment-repository.interface';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import {
  PaginatedResult,
  FindAllOptions,
} from '../app/interfaces/repository.interface';

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({ data });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({ where: { id } });
  }

  async findAll(
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Appointment>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: options?.where,
        orderBy: options?.orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          patient: true,
          clinic: true,
          doctor: true,
          vaccination: true,
        },
      }),
      this.prisma.appointment.count({ where: options?.where }),
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

  async countByDateAndClinic(date: Date, clinicId: number): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.appointment.count({
      where: {
        clinicId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: AppointmentStatus.SCHEDULED,
      },
    });
  }

  async findByPatientId(
    patientId: string,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Appointment>> {
    return this.findAll({
      ...options,
      where: { ...options?.where, patientId },
    });
  }

  async findByClinicId(
    clinicId: number,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Appointment>> {
    return this.findAll({
      ...options,
      where: { ...options?.where, clinicId },
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(clinicId && { clinicId }),
      },
      include: {
        patient: true,
        clinic: true,
        doctor: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.AppointmentUpdateInput,
  ): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }
}
