import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ManagerReportPeriodUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'managerReportPeriodId is required' })
  managerReportPeriodId: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startPeriod?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endPeriod?: Date;
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  sumStartPeriod?: number;
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  sumEndPeriod?: number;
}
