import { PeriodTechTask, TypeTechTask } from '@prisma/client';
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
  @IsEnum(PeriodTechTask)
  @IsNotEmpty({ message: 'Type pos is required' })
  period: PeriodTechTask;
  @IsNotEmpty({ message: 'startDate is required' })
  @Transform(({ value }) => new Date(value))
  startDate: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  endSpecifiedDate?: Date;
  @IsArray()
  @IsNotEmpty({ message: 'posId is required' })
  techTaskItem: number[];
}
