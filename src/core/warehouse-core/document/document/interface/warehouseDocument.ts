import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { WarehouseDocumentType } from '@prisma/client';

export abstract class IWarehouseDocumentRepository {
  abstract create(input: WarehouseDocument): Promise<WarehouseDocument>;
  abstract findOneById(id: number): Promise<WarehouseDocument>;
  abstract findOneByName(name: string): Promise<WarehouseDocument>;
  abstract findAllByWarehouseId(
    warehouseId: number,
  ): Promise<WarehouseDocument[]>;
  abstract findAllByWarehouseIdAndDate(
    warehouseId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<WarehouseDocument[]>;
  abstract findAllByWarehouseIdAndType(
    warehouseId: number,
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]>;
  abstract findAllByType(
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]>;
  abstract update(input: WarehouseDocument): Promise<WarehouseDocument>;
}
