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
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or clinic at capacity',
  })
  @ApiResponse({ status: 404, description: 'Patient or clinic not found' })
  @ApiResponse({
    status: 409,
    description: 'Clinic at capacity for selected date',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'List all appointments with filters' })
  @ApiResponse({
    status: 200,
    description: 'Appointments retrieved successfully',
  })
  findAll(@Query() query: AppointmentQueryDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get an appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment found' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot update completed appointment',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Cancel an appointment' })
  @ApiResponse({
    status: 200,
    description: 'Appointment cancelled successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot cancel completed appointment',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  cancel(@Param('id') id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete completed appointment',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
