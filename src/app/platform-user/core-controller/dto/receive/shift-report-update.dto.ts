import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { TypeWorkDay } from "@finance/shiftReport/shiftReport/domain/typeWorkDay";
import { TypeEstimation } from "@finance/shiftReport/shiftReport/domain/typeEstimation";

export class ShiftReportUpdateDto {
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
  @IsString()
  @IsOptional()
  comment?: string;
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return JSON.parse(value);
    return [];
  })
  gradingData?: gradingDataDto[];
}

export class gradingDataDto {
  @IsNumber()
  @IsNotEmpty({ message: 'parameterId is required' })
  parameterId: number;
  @IsString()
  @IsNotEmpty({ message: 'estimationId is required' })
  estimationId: number;
}
