import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    example: '12345678901',
    description: 'PESEL number (11 digits)',
  })
  @IsString()
  @Length(11, 11, { message: 'PESEL must be exactly 11 digits' })
  @Matches(/^\d+$/, { message: 'PESEL must contain only digits' })
  pesel!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+48123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Warsaw', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '00-001', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;
}
