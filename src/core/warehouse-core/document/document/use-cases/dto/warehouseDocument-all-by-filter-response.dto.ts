import { WarehouseDocumentType } from "@prisma/client";

export class WarehouseDocumentAllByFilterResponseDto {
  id: number;
  name: string;
  type: WarehouseDocumentType;
  warehouseId: number;
  responsibleId: number;
  carryingAt: Date;
}