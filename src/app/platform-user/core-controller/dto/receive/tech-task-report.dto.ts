import { IsNotEmpty, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { TypeTechTask } from "@tech-task/techTask/domain/typeTechTask";

export class TechTaskReportDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  organizationId?: number;
  @IsOptional()
  type?: TypeTechTask;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  executorId?: number;
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];
  @IsOptional()
  @IsDateString()
  startDate?: string;
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
