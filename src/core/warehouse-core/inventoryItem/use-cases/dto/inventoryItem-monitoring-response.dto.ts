import { MeasurementNomenclature } from '@prisma/client';

export class InventoryItemMonitoringResponseDto {
  nomenclatureId: number;
  nomenclatureName: string;
  categoryName: string;
  measurement: MeasurementNomenclature;
  sum?: number;
  inventoryItems: InventoryItemData[];
}

export class InventoryItemData {
  warehouseName: string;
  quantity?: number;
}
