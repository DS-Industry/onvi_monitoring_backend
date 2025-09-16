import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class ClientUpdateDto {
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
  @IsBoolean()
  notification?: boolean;
}