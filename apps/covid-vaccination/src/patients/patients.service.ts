import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import { AppointmentRepository } from '../appointments/appointment.repository';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { AppointmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(
    private patientRepository: PatientRepository,
    private appointmentRepository: AppointmentRepository,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const existingPatient = await this.patientRepository.findByPesel(
      createPatientDto.pesel,
    );

    if (existingPatient) {
      throw new ConflictException('Patient with this PESEL already exists');
    }

    try {
      return await this.patientRepository.create({
        pesel: createPatientDto.pesel,
        firstName: createPatientDto.firstName,
        lastName: createPatientDto.lastName,
        dateOfBirth: new Date(createPatientDto.dateOfBirth),
        email: createPatientDto.email,
        phone: createPatientDto.phone,
        address: createPatientDto.address,
        city: createPatientDto.city,
        postalCode: createPatientDto.postalCode,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Patient with this PESEL already exists');
        }
      }
      throw error;
    }
  }

  async findAll(query: PatientQueryDto) {
    const where: Prisma.PatientWhereInput = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { pesel: { contains: query.search } },
      ];
    }

    if (query.city) {
      where.city = query.city;
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const orderBy: Prisma.PatientOrderByWithRelationInput =
      sortBy === 'firstName'
        ? { firstName: sortOrder }
        : sortBy === 'lastName'
          ? { lastName: sortOrder }
          : sortBy === 'pesel'
            ? { pesel: sortOrder }
            : sortBy === 'city'
              ? { city: sortOrder }
              : { createdAt: sortOrder };

    return this.patientRepository.findAll({
      page: query.page,
      limit: query.limit,
      where,
      orderBy,
    });
  }

  async findOne(id: string, includeRelations = false) {
    if (includeRelations) {
      const patient = await this.patientRepository.findByIdWithAppointments(id);

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      return patient;
    }

    const patient = await this.patientRepository.findById(id);

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    // Validate patient exists
    await this.findOne(id);

    try {
      return await this.patientRepository.update(id, {
        ...updatePatientDto,
        ...(updatePatientDto.dateOfBirth && {
          dateOfBirth: new Date(updatePatientDto.dateOfBirth),
        }),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Patient with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Patient with this PESEL already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: string) {
    // Validate patient exists
    await this.findOne(id);

    const patientAppointments =
      await this.appointmentRepository.findByPatientId(id, { limit: 1 });

    const hasActiveAppointments = patientAppointments.data.some(
      (appointment) => appointment.status === AppointmentStatus.SCHEDULED,
    );

    if (hasActiveAppointments) {
      throw new ConflictException(
        'Cannot delete patient with active appointments',
      );
    }

    await this.patientRepository.delete(id);

    return { message: 'Patient deleted successfully' };
  }
}
