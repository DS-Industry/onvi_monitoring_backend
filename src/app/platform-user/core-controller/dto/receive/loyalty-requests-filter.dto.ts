import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LTYProgramRequestStatus } from '@prisma/client';

export class LoyaltyHubRequestsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 10;

  @IsOptional()
  @IsEnum(LTYProgramRequestStatus)
  status?: LTYProgramRequestStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  organizationId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
