import { Appointment, Prisma } from '@prisma/client';
import {
  IRepository,
  FindAllOptions,
  PaginatedResult,
} from '../../app/interfaces/repository.interface';

export interface IAppointmentRepository
  extends IRepository<
    Appointment,
    Prisma.AppointmentCreateInput,
    Prisma.AppointmentUpdateInput
  > {
  countByDateAndClinic(date: Date, clinicId: number): Promise<number>;
  findByPatientId(
    patientId: string,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Appointment>>;
  findByClinicId(
    clinicId: number,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Appointment>>;
  findByDateRange(
    startDate: Date,
    endDate: Date,
    clinicId?: number,
  ): Promise<Appointment[]>;
}
