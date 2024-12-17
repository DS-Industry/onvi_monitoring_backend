import { WarehouseDocumentType } from '@prisma/client';

export class WarehouseDocumentCreateDto {
  name: string;
  type: WarehouseDocumentType;
  warehouseId: number;
  responsibleId: number;
  carryingAt: Date;
}