import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoryUpdateDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    value = value.trim();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  })
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
}
