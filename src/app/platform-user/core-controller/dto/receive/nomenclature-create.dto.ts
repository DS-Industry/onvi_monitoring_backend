import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NomenclatureCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'sku is required' })
  sku: string;
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'categoryId is required' })
  categoryId: number;
  @IsNumber()
  @IsOptional()
  supplierId?: number;
}
