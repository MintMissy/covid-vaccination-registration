import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class AppointmentQueryDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ example: 10, required: false, default: 10, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clinicId?: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  doctorId?: string;

  @ApiProperty({ enum: AppointmentStatus, required: false })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 'createdAt', required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ enum: SortOrder, required: false, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
