import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientQueryDto, SortOrder } from './dto/patient-query.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Patient } from '@prisma/client';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockPatient: Patient = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    pesel: '12345678901',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    email: 'john.doe@example.com',
    phone: '+48123456789',
    address: '123 Main St',
    city: 'Warsaw',
    postalCode: '00-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPatientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a patient successfully', async () => {
      // Arrange
      const createPatientDto: CreatePatientDto = {
        pesel: '12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        email: 'john.doe@example.com',
        phone: '+48123456789',
        address: '123 Main St',
        city: 'Warsaw',
        postalCode: '00-001',
      };

      mockPatientsService.create.mockResolvedValue(mockPatient);

      // Act
      const result = await controller.create(createPatientDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createPatientDto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatient);
      expect(result.pesel).toBe('12345678901');
      expect(result.firstName).toBe('John');
    });

    it('should throw ConflictException when PESEL already exists', async () => {
      // Arrange
      const createPatientDto: CreatePatientDto = {
        pesel: '12345678901',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      const conflictError = new ConflictException(
        'Patient with this PESEL already exists',
      );
      mockPatientsService.create.mockRejectedValue(conflictError);

      // Act & Assert
      await expect(controller.create(createPatientDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createPatientDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle validation errors for invalid PESEL format', async () => {
      // Arrange
      const createPatientDto: CreatePatientDto = {
        pesel: '12345', // Invalid: only 5 digits instead of 11
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
      };

      const validationError = new Error('Validation failed');
      mockPatientsService.create.mockRejectedValue(validationError);

      // Act & Assert
      await expect(controller.create(createPatientDto)).rejects.toThrow();
      expect(service.create).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of patients', async () => {
      // Arrange
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        search: 'John',
        city: 'Warsaw',
        sortBy: 'firstName',
        sortOrder: SortOrder.ASC,
      };

      const mockResult = {
        data: [mockPatient],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockPatientsService.findAll.mockResolvedValue(mockResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a patient by ID', async () => {
      // Arrange
      const patientId = '550e8400-e29b-41d4-a716-446655440000';
      mockPatientsService.findOne.mockResolvedValue(mockPatient);

      // Act
      const result = await controller.findOne(patientId);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(patientId, false);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatient);
      expect(result.id).toBe(patientId);
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      // Arrange
      const patientId = 'non-existent-id';
      const notFoundError = new NotFoundException(
        `Patient with ID ${patientId} not found`,
      );
      mockPatientsService.findOne.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(controller.findOne(patientId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(patientId, false);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should include relations when include query parameter is provided', async () => {
      // Arrange
      const patientId = '550e8400-e29b-41d4-a716-446655440000';
      mockPatientsService.findOne.mockResolvedValue(mockPatient);

      // Act
      const result = await controller.findOne(patientId, 'appointments');

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(patientId, true);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatient);
    });
  });

  describe('update', () => {
    it('should update a patient successfully', async () => {
      // Arrange
      const patientId = '550e8400-e29b-41d4-a716-446655440000';
      const updatePatientDto: UpdatePatientDto = {
        firstName: 'Jane',
        email: 'jane.doe@example.com',
      };

      const updatedPatient = {
        ...mockPatient,
        ...updatePatientDto,
        updatedAt: new Date(),
      };

      mockPatientsService.update.mockResolvedValue(updatedPatient);

      // Act
      const result = await controller.update(patientId, updatePatientDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(patientId, updatePatientDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPatient);
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      // Arrange
      const patientId = 'non-existent-id';
      const updatePatientDto: UpdatePatientDto = {
        firstName: 'Jane',
      };

      const notFoundError = new NotFoundException(
        `Patient with ID ${patientId} not found`,
      );
      mockPatientsService.update.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(
        controller.update(patientId, updatePatientDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(patientId, updatePatientDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a patient successfully', async () => {
      // Arrange
      const patientId = '550e8400-e29b-41d4-a716-446655440000';
      const deleteResult = { message: 'Patient deleted successfully' };

      mockPatientsService.remove.mockResolvedValue(deleteResult);

      // Act
      const result = await controller.remove(patientId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(patientId);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(deleteResult);
      expect(result.message).toBe('Patient deleted successfully');
    });

    it('should throw ConflictException when patient has active appointments', async () => {
      // Arrange
      const patientId = '550e8400-e29b-41d4-a716-446655440000';
      const conflictError = new ConflictException(
        'Cannot delete patient with active appointments',
      );

      mockPatientsService.remove.mockRejectedValue(conflictError);

      // Act & Assert
      await expect(controller.remove(patientId)).rejects.toThrow(
        ConflictException,
      );
      expect(service.remove).toHaveBeenCalledWith(patientId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when patient does not exist', async () => {
      // Arrange
      const patientId = 'non-existent-id';
      const notFoundError = new NotFoundException(
        `Patient with ID ${patientId} not found`,
      );

      mockPatientsService.remove.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(controller.remove(patientId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(patientId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
