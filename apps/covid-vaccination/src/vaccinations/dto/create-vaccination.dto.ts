import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVaccinationDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  appointmentId!: string;

  @ApiProperty({ example: 1 })
  vaccineId!: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  doctorId!: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  administeredAt!: string;

  @ApiProperty({ example: '2025-01-25T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  nextDoseDate?: string;

  @ApiProperty({ example: 'Mild soreness at injection site', required: false })
  @IsOptional()
  @IsString()
  sideEffects?: string;
}
