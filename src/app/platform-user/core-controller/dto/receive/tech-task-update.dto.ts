import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from "class-transformer";
import { StatusTechTask } from "@tech-task/techTask/domain/statusTechTask";
import { PeriodType } from '@tech-task/techTask/domain/periodType';

export class TechTaskUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'techTaskId is required' })
  techTaskId: number;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsEnum(StatusTechTask)
  status?: StatusTechTask;
  @IsEnum(PeriodType)
  @IsOptional()
  periodType?: PeriodType;
  @ValidateIf(o => o.periodType === PeriodType.CUSTOM)
  @IsNumber({}, { message: 'customPeriodDays must be a number when periodType is CUSTOM' })
  @IsOptional()
  customPeriodDays?: number;
  @IsString()
  @IsOptional()
  markdownDescription?: string;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endSpecifiedDate?: Date;
  @IsArray()
  @IsOptional()
  techTaskItem?: number[];
}
