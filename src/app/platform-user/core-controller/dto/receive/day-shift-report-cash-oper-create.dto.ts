import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';
import { Transform } from 'class-transformer';

export class DayShiftReportCashOperCreateDto {
  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(TypeWorkDayShiftReportCashOper)
  type: TypeWorkDayShiftReportCashOper;
  @IsNotEmpty({ message: 'sum is required' })
  @IsNumber()
  sum: number;
  @IsOptional()
  @IsNumber()
  carWashDeviceId?: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  eventData?: Date;
  @IsOptional()
  @IsString()
  comment?: string;
}
