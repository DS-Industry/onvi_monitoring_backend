import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { StatusUser } from '@prisma/client';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(StatusUser)
  status?: StatusUser;

  @IsOptional()
  @IsString()
  refreshTokenId?: string;
}
