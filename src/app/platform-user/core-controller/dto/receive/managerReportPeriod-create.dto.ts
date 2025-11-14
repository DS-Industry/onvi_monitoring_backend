import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ManagerReportPeriodCreateDto {
  @IsNotEmpty({ message: 'startPeriod is required' })
  @Transform(({ value }) => new Date(value))
  startPeriod: Date;
  @IsNotEmpty({ message: 'endPeriod is required' })
  @Transform(({ value }) => new Date(value))
  endPeriod: Date;
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'sumStartPeriod is required' })
  sumStartPeriod: number;
  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty({ message: 'sumEndPeriod is required' })
  sumEndPeriod: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'sumEndPeriod is required' })
  userId: number;
}
