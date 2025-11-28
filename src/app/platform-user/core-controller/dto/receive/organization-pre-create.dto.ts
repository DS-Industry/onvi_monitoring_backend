import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypeOrganization } from '@organization/organization/domain/typeOrganization';

export class OrganizationPreCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  fullName: string;
  @IsEnum(TypeOrganization)
  @IsNotEmpty({ message: 'Type org is required' })
  organizationType: TypeOrganization;
  @IsString()
  @IsNotEmpty({ message: 'addressRegistration is required' })
  addressRegistration: string;
}
