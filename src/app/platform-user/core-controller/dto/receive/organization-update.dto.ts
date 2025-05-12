import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrganizationUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
  @IsString()
  @IsOptional()
  fullName?: string;
  @IsString()
  @IsOptional()
  rateVat?: string;
  @IsString()
  @IsOptional()
  inn?: string;
  @IsString()
  @IsOptional()
  okpo?: string;
  @IsString()
  @IsOptional()
  kpp?: string;
  @IsString()
  @IsOptional()
  addressRegistration?: string;
  @IsString()
  @IsOptional()
  ogrn?: string;
  @IsString()
  @IsOptional()
  bik?: string;
  @IsString()
  @IsOptional()
  correspondentAccount?: string;
  @IsString()
  @IsOptional()
  bank?: string;
  @IsString()
  @IsOptional()
  settlementAccount?: string;
  @IsString()
  @IsOptional()
  addressBank?: string;
  @IsString()
  @IsOptional()
  certificateNumber?: string;
  @IsDate()
  @IsOptional()
  dateCertificate?: Date;
}
