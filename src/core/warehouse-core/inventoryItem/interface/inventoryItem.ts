import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';

export abstract class IInventoryItemRepository {
  abstract create(input: InventoryItem): Promise<InventoryItem>;
  abstract findOneById(id: number): Promise<InventoryItem>;
  abstract findAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<InventoryItem[]>;
  abstract findAllByWarehouseId(warehouseId: number): Promise<InventoryItem[]>;
  abstract findOneByNomenclatureIdAndWarehouseId(
    nomenclatureId: number,
    warehouseId: number,
  ): Promise<InventoryItem>;
  abstract findAllByNomenclatureIdsAndWarehouseIds(
    nomenclatureIds: number[],
    warehouseIds: number[],
  ): Promise<InventoryItem[]>;
  abstract update(input: InventoryItem): Promise<InventoryItem>;
  abstract updateMany(input: InventoryItem[]): Promise<void>;
}
