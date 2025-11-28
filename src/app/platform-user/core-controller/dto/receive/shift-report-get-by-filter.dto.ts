import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TypeWorkDay } from '@finance/shiftReport/shiftReport/domain/typeWorkDay';

export class ShiftReportGetByFilterDto {
  @IsNumber()
  @IsNotEmpty({ message: 'workerId is required' })
  workerId: number;
  @IsNotEmpty({ message: 'workDate is required' })
  @Transform(({ value }) => new Date(value))
  workDate: Date;
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId: number;
  @IsNotEmpty({ message: 'typeWorkDay is required' })
  @IsEnum(TypeWorkDay)
  typeWorkDay: TypeWorkDay;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startWorkingTime?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endWorkingTime?: Date;
}
