import { TypeTechTask } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsNumber()
  @IsOptional()
  period?: number;
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
