import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { Transform } from "class-transformer";

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
  @IsNumber()
  @IsOptional()
  period?: number;
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
