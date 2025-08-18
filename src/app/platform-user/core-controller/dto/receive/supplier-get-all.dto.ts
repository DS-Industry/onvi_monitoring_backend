import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SupplierGetAllDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
