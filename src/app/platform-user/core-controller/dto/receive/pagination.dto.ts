import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
