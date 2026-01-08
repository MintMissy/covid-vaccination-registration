import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientRepository } from '../patients/patient.repository';
import { AppointmentRepository } from '../appointments/appointment.repository';
import { ClinicRepository } from '../clinics/clinic.repository';
import { VaccineRepository } from '../vaccinations/vaccine.repository';
import { DoctorRepository } from '../doctors/doctor.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PatientRepository,
    AppointmentRepository,
    ClinicRepository,
    VaccineRepository,
    DoctorRepository,
  ],
  exports: [
    PatientRepository,
    AppointmentRepository,
    ClinicRepository,
    VaccineRepository,
    DoctorRepository,
  ],
})
export class RepositoriesModule {}
