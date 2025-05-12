import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @Transform(({ value }) => {
    value = value.trim();
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  })
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  ownerCategoryId?: number;
}
