import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('vaccinations')
@ApiBearerAuth('JWT-auth')
@Controller('vaccinations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Record a vaccination' })
  @ApiResponse({
    status: 201,
    description: 'Vaccination recorded successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({
    status: 404,
    description: 'Appointment, vaccine, or doctor not found',
  })
  create(@Body() createVaccinationDto: CreateVaccinationDto) {
    return this.vaccinationsService.create(createVaccinationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'List all vaccinations' })
  @ApiResponse({
    status: 200,
    description: 'Vaccinations retrieved successfully',
  })
  findAll() {
    return this.vaccinationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get a vaccination by ID' })
  @ApiResponse({ status: 200, description: 'Vaccination found' })
  @ApiResponse({ status: 404, description: 'Vaccination not found' })
  findOne(@Param('id') id: string) {
    return this.vaccinationsService.findOne(id);
  }
}
