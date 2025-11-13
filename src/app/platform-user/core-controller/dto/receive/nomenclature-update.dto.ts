import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurposeType } from '@warehouse/nomenclature/interface/nomenclatureMeta';
import { MeasurementNomenclature } from '@warehouse/nomenclature/domain/measurementNomenclature';

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
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  metaData?: NomenclatureMetaDto;
}
