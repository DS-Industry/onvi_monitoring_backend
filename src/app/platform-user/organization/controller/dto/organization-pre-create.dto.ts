import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressCreateDto } from '@address/use-case/dto/address-create.dto';
import { Type } from 'class-transformer';
import { TypeOrganization } from '@prisma/client';

export class OrganizationPreCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsEnum(TypeOrganization)
  @IsNotEmpty({ message: 'Type org is required' })
  organizationType: TypeOrganization;
  @Type(() => AddressCreateDto)
  @ValidateNested()
  address: AddressCreateDto;
}
