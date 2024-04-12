import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsDate()
  @IsOptional()
  birthday?: Date;
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
}
