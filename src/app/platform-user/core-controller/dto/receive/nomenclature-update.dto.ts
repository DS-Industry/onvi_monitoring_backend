import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NomenclatureUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'nomenclatureId is required' })
  nomenclatureId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsNumber()
  @IsOptional()
  categoryId?: number;
  @IsNumber()
  @IsOptional()
  supplierId?: number;
}
