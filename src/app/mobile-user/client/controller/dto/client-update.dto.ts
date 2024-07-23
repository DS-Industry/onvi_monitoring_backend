import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatusUser } from '@prisma/client';

export class UpdateClientDto {
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
  status?: StatusUser;
  @IsNumber()
  @IsOptional()
  loyaltyCardId?: number;
  @IsNumber()
  @IsOptional()
  mobileUserRoleId?: number;
}
