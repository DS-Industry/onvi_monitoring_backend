import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TypeOrganization } from '@prisma/client';
import { AddressCreateDto } from '@platform-user/organization/controller/dto/address-create.dto';

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
