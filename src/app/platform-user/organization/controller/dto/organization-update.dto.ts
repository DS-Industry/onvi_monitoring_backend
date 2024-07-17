import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { StatusOrganization, TypeOrganization } from '@prisma/client';

export class UpdateOrganizationDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
  @IsNumber()
  @IsOptional()
  organizationDocumentId?: number;
  @IsEnum(TypeOrganization)
  @IsOptional()
  organizationType?: TypeOrganization;
  @IsEnum(StatusOrganization)
  @IsOptional()
  organizationStatus?: StatusOrganization;
}
