import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PeriodTechTask, StatusTechTask, TypeTechTask } from '@prisma/client';
import { Transform } from "class-transformer";

export class TechTaskUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'techTaskId is required' })
  techTaskId: number;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsEnum(TypeTechTask)
  type?: TypeTechTask;
  @IsOptional()
  @IsEnum(StatusTechTask)
  status?: StatusTechTask;
  @IsOptional()
  @IsEnum(PeriodTechTask)
  period?: PeriodTechTask;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endSpecifiedDate?: Date;
  @IsArray()
  @IsOptional()
  techTaskItem?: number[];
}
