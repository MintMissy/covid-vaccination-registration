import { Patient, Prisma } from '@prisma/client';
import {
  IRepository,
  FindAllOptions,
  PaginatedResult,
} from '../../app/interfaces/repository.interface';

export interface IPatientRepository
  extends IRepository<
    Patient,
    Prisma.PatientCreateInput,
    Prisma.PatientUpdateInput
  > {
  findByPesel(pesel: string): Promise<Patient | null>;
  findByCity(
    city: string,
    options?: FindAllOptions,
  ): Promise<PaginatedResult<Patient>>;
  findByIdWithAppointments(id: string): Promise<Patient | null>;
}
