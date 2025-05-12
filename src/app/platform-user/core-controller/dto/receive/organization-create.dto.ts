import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeOrganization } from '@prisma/client';

export class OrganizationCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  fullName: string;
  @IsEnum(TypeOrganization)
  @IsNotEmpty({ message: 'Type org is required' })
  organizationType: TypeOrganization;
  @IsString()
  @IsNotEmpty({ message: 'rateVat is required' })
  rateVat: string;
  @IsString()
  @IsNotEmpty({ message: 'inn is required' })
  inn: string;
  @IsString()
  @IsNotEmpty({ message: 'okpo is required' })
  okpo: string;
  @IsString()
  @IsOptional()
  kpp?: string;
  @IsString()
  @IsNotEmpty({ message: 'addressRegistration is required' })
  addressRegistration: string;
  @IsString()
  @IsNotEmpty({ message: 'ogrn is required' })
  ogrn: string;
  @IsString()
  @IsNotEmpty({ message: 'bik is required' })
  bik: string;
  @IsString()
  @IsNotEmpty({ message: 'correspondentAccount is required' })
  correspondentAccount: string;
  @IsString()
  @IsNotEmpty({ message: 'bank is required' })
  bank: string;
  @IsString()
  @IsNotEmpty({ message: 'settlementAccount is required' })
  settlementAccount: string;
  @IsString()
  @IsNotEmpty({ message: 'address is required' })
  addressBank: string;
  @IsString()
  @IsOptional()
  certificateNumber?: string;
  @IsDate()
  @IsOptional()
  dateCertificate?: Date;
}
