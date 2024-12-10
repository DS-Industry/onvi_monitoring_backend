import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { MeasurementNomenclature } from '@prisma/client';

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
  @IsEnum(MeasurementNomenclature)
  @IsNotEmpty({ message: 'measurement is required' })
  measurement: MeasurementNomenclature;
}
