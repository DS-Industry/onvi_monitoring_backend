import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PeriodTechTask, StatusTechTask, TypeTechTask } from '@prisma/client';

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
  @IsArray()
  @IsOptional()
  techTaskItem?: number[];
}
