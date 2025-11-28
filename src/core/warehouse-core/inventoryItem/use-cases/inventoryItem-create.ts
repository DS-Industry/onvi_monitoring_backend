import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { InventoryItemCreateDto } from '@warehouse/inventoryItem/use-cases/dto/inventoryItem-create.dto';

@Injectable()
export class CreateInventoryItemUseCase {
  constructor(
    private readonly inventoryItemRepository: IInventoryItemRepository,
  ) {}

  async execute(input: InventoryItemCreateDto): Promise<InventoryItem> {
    const inventoryItemData = new InventoryItem({
      nomenclatureId: input.nomenclatureId,
      quantity: 0,
      warehouseId: input.warehouseId,
    });
    return await this.inventoryItemRepository.create(inventoryItemData);
  }

  async executeMany(
    inputs: InventoryItemCreateDto[],
  ): Promise<InventoryItem[]> {
    const inventoryItemsData = inputs.map(
      (input) =>
        new InventoryItem({
          nomenclatureId: input.nomenclatureId,
          quantity: 0,
          warehouseId: input.warehouseId,
        }),
    );
    return await this.inventoryItemRepository.createMany(inventoryItemsData);
  }
}
