import { TypeEstimation, TypeWorkDay } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DayShiftReportUpdateDto {
  @IsOptional()
  @IsEnum(TypeWorkDay)
  typeWorkDay?: TypeWorkDay;
  @IsString()
  @IsOptional()
  timeWorkedOut?: string;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startWorkingTime?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endWorkingTime?: Date;
  @IsOptional()
  @IsEnum(TypeEstimation)
  estimation?: TypeEstimation;
  @IsNumber()
  @IsOptional()
  prize?: number;
  @IsNumber()
  @IsOptional()
  fine?: number;
  @IsString()
  @IsOptional()
  comment?: string;
}
