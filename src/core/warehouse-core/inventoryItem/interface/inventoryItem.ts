import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { NomenclatureStatus } from "@prisma/client";

export abstract class IInventoryItemRepository {
  abstract create(input: InventoryItem): Promise<InventoryItem>;
  abstract createMany(input: InventoryItem[]): Promise<InventoryItem[]>;
  abstract findOneById(id: number): Promise<InventoryItem>;
  abstract findAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<InventoryItem[]>;
  abstract findAllByWarehouseId(warehouseId: number): Promise<InventoryItem[]>;
  abstract findOneByNomenclatureIdAndWarehouseId(
    nomenclatureId: number,
    warehouseId: number,
  ): Promise<InventoryItem>;
  abstract findAllByWarehouseIdsForInventory(
    warehouseIds: number[],
    organizationId?: number,
    categoryId?: number,
    status?: NomenclatureStatus,
    skip?: number,
    take?: number,
  ): Promise<InventoryItem[]>;
  abstract findCountByWarehouseIdsForInventory(
    warehouseIds: number[],
    organizationId?: number,
    categoryId?: number,
    status?: NomenclatureStatus,
  ): Promise<number>;
  abstract findAllByNomenclatureIdsAndWarehouseIds(
    nomenclatureIds: number[],
    warehouseIds: number[],
  ): Promise<InventoryItem[]>;
  abstract update(input: InventoryItem): Promise<InventoryItem>;
  abstract updateMany(input: InventoryItem[]): Promise<void>;
}
