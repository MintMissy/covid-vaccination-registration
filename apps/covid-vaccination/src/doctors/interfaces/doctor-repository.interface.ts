import { Doctor, Prisma } from '@prisma/client';
import { IRepository } from '../../app/interfaces/repository.interface';

export interface IDoctorRepository
  extends IRepository<
    Doctor,
    Prisma.DoctorCreateInput,
    Prisma.DoctorUpdateInput
  > {
  findByClinicId(clinicId: number): Promise<Doctor[]>;
  findByLicenseNumber(licenseNumber: string): Promise<Doctor | null>;
  findByUserId(userId: string): Promise<Doctor | null>;
}
