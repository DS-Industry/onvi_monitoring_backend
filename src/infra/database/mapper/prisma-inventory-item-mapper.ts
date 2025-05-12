import { InventoryItem as PrismaInventoryItem, Prisma } from '@prisma/client';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';

export class PrismaInventoryItemMapper {
  static toDomain(entity: PrismaInventoryItem): InventoryItem {
    if (!entity) {
      return null;
    }
    return new InventoryItem({
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      quantity: entity.quantity,
      warehouseId: entity.warehouseId,
    });
  }

  static toPrisma(
    inventoryItem: InventoryItem,
  ): Prisma.InventoryItemUncheckedCreateInput {
    return {
      id: inventoryItem?.id,
      nomenclatureId: inventoryItem.nomenclatureId,
      quantity: inventoryItem.quantity,
      warehouseId: inventoryItem.warehouseId,
    };
  }
}
