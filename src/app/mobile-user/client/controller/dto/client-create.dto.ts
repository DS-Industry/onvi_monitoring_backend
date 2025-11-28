import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ContractType, StatusUser } from '@prisma/client';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsEnum(StatusUser)
  @IsOptional()
  status?: StatusUser;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsOptional()
  placementId?: number;

  @IsOptional()
  workerCorporateId?: number;

  @IsString()
  @IsOptional()
  refreshTokenId?: string;
}
