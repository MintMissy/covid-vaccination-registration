import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('patients')
@ApiBearerAuth('JWT-auth')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 409,
    description: 'Patient with PESEL already exists',
  })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'List all patients with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  findAll(@Query() query: PatientQueryDto) {
    return this.patientsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient found' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'Include relations (appointments)',
  })
  findOne(@Param('id') id: string, @Query('include') include?: string) {
    return this.patientsService.findOne(id, include === 'appointments');
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete patient with active appointments',
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
