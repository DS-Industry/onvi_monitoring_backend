import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WarehouseDocumentType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class WarehouseDocumentCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(WarehouseDocumentType)
  @IsNotEmpty({ message: 'type is required' })
  type: WarehouseDocumentType;
  @IsNumber()
  @IsNotEmpty({ message: 'warehouseId is required' })
  warehouseId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'responsibleId is required' })
  responsibleId: number;
  @IsNotEmpty({ message: 'carryingAt is required' })
  @Transform(({ value }) => new Date(value))
  carryingAt: Date;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WarehouseDocumentDetailCreateDto)
  details: WarehouseDocumentDetailCreateDto[];
}

export class WarehouseDocumentDetailCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'nomenclatureId is required' })
  nomenclatureId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number;
  @IsOptional()
  @IsString()
  comment?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  metaData?: InventoryMetaDataTypeCreateDto | MovingMetaDataTypeCreateDto;
}

export class InventoryMetaDataTypeCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'oldQuantity is required' })
  oldQuantity: number;
  @IsNumber()
  @IsNotEmpty({ message: 'deviation is required' })
  deviation: number;
}

export class MovingMetaDataTypeCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'warehouseReceirId is required' })
  warehouseReceirId: number;
}
