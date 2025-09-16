import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class HistOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  size?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;
}
