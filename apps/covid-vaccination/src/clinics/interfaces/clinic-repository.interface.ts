import { Clinic, Prisma } from '@prisma/client';
import { IRepository } from '../../app/interfaces/repository.interface';

export interface IClinicRepository
  extends IRepository<
    Clinic,
    Prisma.ClinicCreateInput,
    Prisma.ClinicUpdateInput
  > {
  findByIdWithDoctors(id: number): Promise<Clinic | null>;
  findByIdWithAppointments(id: number): Promise<Clinic | null>;
}
