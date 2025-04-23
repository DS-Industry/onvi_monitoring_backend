import { IsEnum, IsOptional } from 'class-validator';
import { CategoryReportTemplate } from '@prisma/client';
import { Transform } from "class-transformer";

export class ReportAllFilterDto {
  @IsOptional()
  @IsEnum(CategoryReportTemplate)
  category?: CategoryReportTemplate;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
