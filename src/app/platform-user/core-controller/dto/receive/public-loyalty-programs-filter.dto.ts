import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { LTYProgramStatus } from '@prisma/client';

export class PublicLoyaltyProgramsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 10;

  @IsOptional()
  @IsEnum(LTYProgramStatus)
  status?: LTYProgramStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
