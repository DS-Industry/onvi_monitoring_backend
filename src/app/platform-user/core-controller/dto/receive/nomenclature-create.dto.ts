import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MeasurementNomenclature } from '@prisma/client';
import { Type } from 'class-transformer';
import { PurposeType } from "@warehouse/nomenclature/interface/nomenclatureMeta";
export class NomenclatureMetaDto {
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  weight?: number;
  @IsNumber()
  @IsOptional()
  height?: number;
  @IsNumber()
  @IsOptional()
  width?: number;
  @IsNumber()
  @IsOptional()
  length?: number;
  @IsEnum(PurposeType)
  @IsOptional()
  purpose?: PurposeType;
}

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
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  metaData?: NomenclatureMetaDto;
}
