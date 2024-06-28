import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressCreateDto } from '@address/use-case/dto/address-create.dto';
import { Type } from 'class-transformer';
import { TypeOrganization } from '@prisma/client';

export class OrganizationCreateDto {
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
