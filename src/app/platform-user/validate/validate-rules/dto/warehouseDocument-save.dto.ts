export class WarehouseDocumentSaveDto {
  warehouseDocumentId: number;
  warehouseId: number;
  responsibleId: number;
  ability: any;
  details: WarehouseDocumentDetailSaveDto[];
}

export class WarehouseDocumentDetailSaveDto {
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
