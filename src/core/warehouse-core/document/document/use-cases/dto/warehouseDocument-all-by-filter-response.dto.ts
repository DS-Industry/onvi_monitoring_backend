import { WarehouseDocumentStatus, WarehouseDocumentType } from "@prisma/client";

export class WarehouseDocumentAllByFilterResponseDto {
  id: number;
  name: string;
  type: WarehouseDocumentType;
  warehouseId: number;
  responsibleId: number;
  status: WarehouseDocumentStatus;
  carryingAt: Date;
}