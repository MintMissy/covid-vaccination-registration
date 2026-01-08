import { Vaccine, Prisma } from '@prisma/client';
import { IRepository } from '../../app/interfaces/repository.interface';

export interface IVaccineRepository
  extends IRepository<
    Vaccine,
    Prisma.VaccineCreateInput,
    Prisma.VaccineUpdateInput
  > {
  findByBatchNumber(batchNumber: string): Promise<Vaccine | null>;
  findNonExpired(): Promise<Vaccine[]>;
}
