import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TypeTechTask } from "@tech-task/techTask/domain/typeTechTask";
import { PeriodType } from '@tech-task/techTask/domain/periodType';

export class TechTaskCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsNumber()
  @IsNotEmpty({ message: 'posId is required' })
  posId: number;
  @IsEnum(TypeTechTask)
  @IsNotEmpty({ message: 'Type pos is required' })
  type: TypeTechTask;
  @IsEnum(PeriodType)
  @IsOptional()
  periodType?: PeriodType;
  @ValidateIf(o => o.periodType === PeriodType.CUSTOM)
  @IsNumber({}, { message: 'customPeriodDays must be a number when periodType is CUSTOM' })
  @IsNotEmpty({ message: 'customPeriodDays is required when periodType is CUSTOM' })
  customPeriodDays?: number;
  @IsString()
  @IsOptional()
  markdownDescription?: string;
  @IsNotEmpty({ message: 'startDate is required' })
  @Transform(({ value }) => new Date(value))
  startDate: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endSpecifiedDate?: Date;
  @IsArray()
  @IsNotEmpty({ message: 'techTaskItemId is required' })
  techTaskItem: number[];
  @IsArray()
  @IsNotEmpty({ message: 'tagIds is required' })
  tagIds: number[];
}
