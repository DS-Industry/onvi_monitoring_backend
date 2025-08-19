import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from "class-transformer";
import { CategoryReportTemplate } from "@report/report/domain/categoryReportTemplate";

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
