import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoyaltyProgramCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsArray()
  @IsNotEmpty({ message: 'OrganizationIds is required' })
  organizationIds: number[];
  @IsNumber()
  @IsOptional()
  lifetimeDays?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'Owner organizationId is required' })
  ownerOrganizationId: number;
}
