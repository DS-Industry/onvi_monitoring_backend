import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { MeasurementNomenclature } from '@prisma/client';

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
  @IsEnum(MeasurementNomenclature)
  @IsOptional()
  measurement?: MeasurementNomenclature;
}
