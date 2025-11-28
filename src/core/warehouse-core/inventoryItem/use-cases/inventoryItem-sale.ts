import { Injectable } from '@nestjs/common';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';
import { InventoryItemSaleResponseDto } from '@warehouse/inventoryItem/use-cases/dto/inventoryItem-sale-response.dto';
import { FindMethodsSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-find-methods';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';

@Injectable()
export class SaleInventoryItemUseCase {
  constructor(
    private readonly findMethodsSalePriceUseCase: FindMethodsSalePriceUseCase,
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
  ) {}

  async execute(warehouseId: number): Promise<InventoryItemSaleResponseDto[]> {
    const nomenclatureSaleData =
      await this.findMethodsSalePriceUseCase.getAllByFilter({ warehouseId });

    const nomenclatureIds = nomenclatureSaleData.map(
      (item) => item.nomenclatureId,
    );
    const nomenclatures =
      await this.findMethodsNomenclatureUseCase.getManyByIds(nomenclatureIds);
    const inventoryItems =
      await this.findMethodsInventoryItemUseCase.getAllByWarehouseId(
        warehouseId,
      );
    const nomenclatureMap = new Map(
      nomenclatures.map((nomenclature) => [nomenclature.id, nomenclature]),
    );
    const nomenclatureItemMap = new Map(
      inventoryItems.map((item) => [item.nomenclatureId, item]),
    );

    return nomenclatureSaleData
      .map((item) => {
        const nomenclature = nomenclatureMap.get(item.nomenclatureId);
        const inventoryItem = nomenclatureItemMap.get(item.nomenclatureId);

        if (
          !inventoryItem ||
          !inventoryItem.quantity ||
          inventoryItem.quantity <= 0
        ) {
          return null;
        }

        return {
          nomenclatureId: item.nomenclatureId,
          nomenclatureName: nomenclature?.name || '',
          quantity: inventoryItem.quantity,
          price: item.price,
        };
      })
      .filter((item): item is InventoryItemSaleResponseDto => item !== null);
  }
}
