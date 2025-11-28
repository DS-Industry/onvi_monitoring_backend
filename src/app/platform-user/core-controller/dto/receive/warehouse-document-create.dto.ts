import { IsEnum, IsNotEmpty } from 'class-validator';
import { WarehouseDocumentType } from '@warehouse/warehouse/domain/warehouseDocumentType';

export class WarehouseDocumentCreateDto {
  @IsEnum(WarehouseDocumentType)
  @IsNotEmpty({ message: 'type is required' })
  type: WarehouseDocumentType;
}
