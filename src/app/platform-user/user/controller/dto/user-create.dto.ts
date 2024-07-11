import {   IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
 } from 'class-validator';

export class CreateUserDto{
  
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
  @IsEnum(Gender)
  gender?: Gender;


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
  platformUserRoleId?:number

}