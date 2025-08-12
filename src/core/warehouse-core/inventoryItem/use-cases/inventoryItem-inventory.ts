import { Injectable } from '@nestjs/common';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { InventoryItemInventoryResponseDto } from '@warehouse/inventoryItem/use-cases/dto/inventoryItem-inventory-response.dto';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';

@Injectable()
export class InventoryInventoryItemUseCase {
  constructor(
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
  ) {}

  async execute(
    warehouseId: number,
  ): Promise<InventoryItemInventoryResponseDto[]> {
    const inventoryItems =
      await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
        warehouseId,
      );

    const nomenclatureIds = inventoryItems.map((item) => item.nomenclatureId);
    const nomenclatures =
      await this.findMethodsNomenclatureUseCase.getManyByIds(nomenclatureIds);

    const nomenclatureMap = new Map(
      nomenclatures.map((nomenclature) => [nomenclature.id, nomenclature]),
    );

    return inventoryItems.map((item) => {
      const nomenclature = nomenclatureMap.get(item.nomenclatureId);

      return {
        nomenclatureId: item.nomenclatureId,
        nomenclatureName: nomenclature?.name || '',
        quantity: item.quantity,
      };
    });
  }
}
