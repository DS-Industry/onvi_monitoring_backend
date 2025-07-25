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
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  sumStartPeriod?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  sumEndPeriod?: number;
}
