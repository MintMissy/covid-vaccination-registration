import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ClinicsService } from './clinics.service';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'List all clinics' })
  @ApiResponse({ status: 200, description: 'Clinics retrieved successfully' })
  findAll() {
    return this.clinicsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a clinic by ID' })
  @ApiResponse({ status: 200, description: 'Clinic found' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clinicsService.findOne(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get clinic availability for a date' })
  @ApiResponse({
    status: 200,
    description: 'Availability retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  @ApiQuery({
    name: 'date',
    example: '2024-12-25',
    description: 'Date in ISO format (YYYY-MM-DD)',
  })
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ) {
    return this.clinicsService.getAvailability(id, date);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a clinic' })
  @ApiResponse({ status: 200, description: 'Clinic updated successfully' })
  @ApiResponse({ status: 404, description: 'Clinic not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicsService.update(id, updateClinicDto);
  }
}
