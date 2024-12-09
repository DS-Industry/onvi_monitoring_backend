import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  ownerCategoryId?: number;
}
