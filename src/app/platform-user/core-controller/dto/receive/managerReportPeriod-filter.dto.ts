import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ManagerReportPeriodFilterDto {
  @IsNotEmpty({ message: 'startPeriod is required' })
  @Transform(({ value }) => new Date(value))
  startPeriod: Date;
  @IsNotEmpty({ message: 'endPeriod is required' })
  @Transform(({ value }) => new Date(value))
  endPeriod: Date;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'sumEndPeriod is required' })
  userId: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
