import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
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
  phone?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  avatar?: string;
  @IsNumber()
  @IsOptional()
  receiveNotifications?: number;
}
