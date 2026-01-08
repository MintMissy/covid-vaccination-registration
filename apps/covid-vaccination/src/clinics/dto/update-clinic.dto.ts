import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateClinicDto {
  @ApiProperty({ example: 'City Medical Center', required: false })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({ example: '+48123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'clinic@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 50, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacityPerDay?: number;
}
