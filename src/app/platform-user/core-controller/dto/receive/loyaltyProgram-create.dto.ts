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
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty({ message: 'maxLevels is required' })
  maxLevels: number;
  @IsNumber()
  @IsOptional()
  lifetimeDays?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'Owner organizationId is required' })
  ownerOrganizationId: number;
}
