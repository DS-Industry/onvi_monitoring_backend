import { WarehouseDocumentStatus } from '@prisma/client';

export class WarehouseDocumentUpdateDto {
  warehouseId?: number;
  responsibleId?: number;
  carryingAt?: Date;
  status?: WarehouseDocumentStatus;
}
