import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  patientId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  clinicId!: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  appointmentDate!: string;

  @ApiProperty({ example: 1, description: 'Dose number (1, 2, or booster)' })
  @IsInt()
  @Min(1)
  doseNumber!: number;

  @ApiProperty({ example: 'First dose appointment', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
