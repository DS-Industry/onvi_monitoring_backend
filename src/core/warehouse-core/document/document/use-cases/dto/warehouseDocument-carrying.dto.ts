import { WarehouseDocumentType } from '@prisma/client';

export class WarehouseDocumentCarryingDto {
  name: string;
  type: WarehouseDocumentType;
  warehouseId: number;
  responsibleId: number;
  carryingAt: Date;
  details: WarehouseDocumentDetailCreateDto[];
}

export class WarehouseDocumentDetailCreateDto {
  nomenclatureId: number;
  quantity: number;
  comment?: string;
  metaData?: InventoryMetaDataTypeCreateDto | MovingMetaDataTypeCreateDto;
}

export class InventoryMetaDataTypeCreateDto {
  oldQuantity: number;
  deviation: number;
}

export class MovingMetaDataTypeCreateDto {
  warehouseReceirId: number;
}
