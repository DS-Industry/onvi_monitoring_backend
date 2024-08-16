import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { StatusUser } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  surname?: string;

  @IsString()
  @IsOptional()
  middlename?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsNotEmpty()
  country?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsNumber()
  @IsNotEmpty()
  countryCode?: number;

  @IsNumber()
  @IsNotEmpty()
  timezone?: number;

  @IsString()
  @IsOptional()
  refreshTokenId?: string;

  @IsString()
  @IsOptional()
  status?: StatusUser;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsNumber()
  @IsOptional()
  platformUserRoleId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Password number is required' })
  checkPassword: string;
}
