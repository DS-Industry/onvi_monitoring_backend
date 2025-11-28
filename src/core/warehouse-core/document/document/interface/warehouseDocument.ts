import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';
import { WarehouseDocumentType } from '@prisma/client';
import { PureAbility } from '@casl/ability';

export type PaginatedWarehouseDocuments = {
  data: WarehouseDocument[];
  total: number;
};

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
  abstract getAllByWarehouseIdsAndDate(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  );
  abstract getAllByWarehouseIdsAndDatePaginated(
    dateStart: Date,
    dateEnd: Date,
    ability: PureAbility,
    warehouseId?: number,
    placementId?: number,
    page?: number,
    size?: number,
  ): Promise<PaginatedWarehouseDocuments>;
  abstract findAllByWarehouseIdAndType(
    warehouseId: number,
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]>;
  abstract findAllByType(
    type: WarehouseDocumentType,
  ): Promise<WarehouseDocument[]>;
  abstract update(input: WarehouseDocument): Promise<WarehouseDocument>;
  abstract delete(id: number): Promise<void>;
}
