import { WarehouseDocumentType } from "@prisma/client";

export class WarehouseDocumentCreateDto {
  warehouseId: number;
  responsibleId: number;
  type: WarehouseDocumentType;
  ability: any;
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
