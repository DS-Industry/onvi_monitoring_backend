import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';

@Injectable()
export class UpdateInventoryItemUseCase {
  constructor(
    private readonly inventoryItemRepository: IInventoryItemRepository,
  ) {}

  async updateMany(input: InventoryItem[]): Promise<void> {
    await this.inventoryItemRepository.updateMany(input);
  }
}
