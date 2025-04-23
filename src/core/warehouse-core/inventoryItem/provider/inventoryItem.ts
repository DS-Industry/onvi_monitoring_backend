import { Provider } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { InventoryItemRepository } from '@warehouse/inventoryItem/repository/inventoryItem';

export const InventoryItemRepositoryProvider: Provider = {
  provide: IInventoryItemRepository,
  useClass: InventoryItemRepository,
};
