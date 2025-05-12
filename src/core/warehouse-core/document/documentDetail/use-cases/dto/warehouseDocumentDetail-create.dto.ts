import {
  InventoryMetaDataType,
  MovingMetaDataType,
} from '@warehouse/document/documentDetail/interface/warehouseDocumentType';

export class WarehouseDocumentDetailCreateDto {
  warehouseDocumentId: number;
  nomenclatureId: number;
  quantity: number;
  comment?: string;
  metaData?: InventoryMetaDataType | MovingMetaDataType;
}
