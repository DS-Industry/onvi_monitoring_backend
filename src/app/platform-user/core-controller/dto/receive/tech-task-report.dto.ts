import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TypeTechTask } from '@prisma/client';

export class TechTaskReportDto {
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId: number;
  @IsNotEmpty({ message: 'Type pos is required' })
  type: TypeTechTask | '*';
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
