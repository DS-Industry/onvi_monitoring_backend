import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusPlatformAdmin } from '@prisma/client';

export class UpdateAdminDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  surname?: string;
  @IsString()
  @IsOptional()
  middlename?: string;
  @IsString()
  @IsOptional()
  avatar?: string;
  @IsString()
  @IsOptional()
  country?: string;
  @IsNumber()
  @IsOptional()
  countryCode?: number;
  @IsNumber()
  @IsOptional()
  timezone?: number;
  @IsString()
  @IsOptional()
  refreshTokenId?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  status?: StatusPlatformAdmin;
}
