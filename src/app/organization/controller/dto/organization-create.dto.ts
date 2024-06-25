import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressCreateDto } from '@address/use-case/dto/address-create.dto';
import { Type } from 'class-transformer';

export class OrganizationCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;
  @IsString()
  @IsNotEmpty({ message: 'Organization documents is required' })
  organizationDocuments: string;
  @IsString()
  @IsNotEmpty({ message: 'Status documents is required' })
  organizationStatus: string;
  @IsString()
  @IsNotEmpty({ message: 'Type documents is required' })
  organizationType: string;
  @IsNumber()
  @IsNotEmpty({ message: 'OwnerId is required' })
  ownerId: number;
  @Type(() => AddressCreateDto)
  @ValidateNested()
  address: AddressCreateDto;
}
