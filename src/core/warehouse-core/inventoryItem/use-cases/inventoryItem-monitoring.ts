import { Injectable } from '@nestjs/common';
import { FindMethodsNomenclatureUseCase } from '@warehouse/nomenclature/use-cases/nomenclature-find-methods';
import { FindMethodsWarehouseUseCase } from '@warehouse/warehouse/use-cases/warehouse-find-methods';
import {
  InventoryItemData,
  InventoryItemMonitoringResponseDto,
} from '@warehouse/inventoryItem/use-cases/dto/inventoryItem-monitoring-response.dto';
import { FindMethodsCategoryUseCase } from '@warehouse/category/use-cases/category-find-methods';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { InventoryItemMonitoringDto } from '@platform-user/validate/validate-rules/dto/inventoryItem-monitoring.dto';
import { NomenclatureStatus } from '@prisma/client';
import { FindMethodsInventoryItemUseCase } from '@warehouse/inventoryItem/use-cases/inventoryItem-find-methods';

@Injectable()
export class InventoryItemMonitoringUseCase {
  constructor(
    private readonly findMethodsNomenclatureUseCase: FindMethodsNomenclatureUseCase,
    private readonly findMethodsWarehouseUseCase: FindMethodsWarehouseUseCase,
    private readonly findMethodsCategoryUseCase: FindMethodsCategoryUseCase,
    private readonly findMethodsInventoryItemUseCase: FindMethodsInventoryItemUseCase,
  ) {}

  async execute(
    data: InventoryItemMonitoringDto,
  ): Promise<InventoryItemMonitoringResponseDto[]> {
    let warehouses: Warehouse[] = [];

    if (data.warehouseId) {
      warehouses.push(
        await this.findMethodsWarehouseUseCase.getById(data.warehouseId),
      );
    } else {
      warehouses = await this.findMethodsWarehouseUseCase.geyAllByPermission(
        data.ability,
        data.placementId,
      );
    }

    const inventoryItemPaginations =
      await this.findMethodsInventoryItemUseCase.getAllByWarehouseIdsForInventory(
        {
          warehouseIds: warehouses.map((w) => w.id),
          organizationId: data.orgId,
          categoryId: data.categoryId,
          status: NomenclatureStatus.ACTIVE,
          skip: data.skip,
          take: data.take,
        },
      );

    const nomenclatures =
      await this.findMethodsNomenclatureUseCase.getManyByIds(
        inventoryItemPaginations.map((i) => i.nomenclatureId),
      );

    const inventoryItems =
      await this.findMethodsInventoryItemUseCase.getAllByNomenclatureIdsAndWarehouseIds(
        nomenclatures.map((n) => n.id),
        warehouses.map((w) => w.id),
      );

    const inventoryMap = new Map<number, Map<number, number>>();
    inventoryItems.forEach((item) => {
      if (!inventoryMap.has(item.nomenclatureId)) {
        inventoryMap.set(item.nomenclatureId, new Map());
      }
      inventoryMap
        .get(item.nomenclatureId)
        .set(item.warehouseId, item.quantity);
    });

    const uniqueCategoryIds = [
      ...new Set(nomenclatures.map((n) => n.categoryId)),
    ];
    const categories =
      await this.findMethodsCategoryUseCase.getManyByIds(uniqueCategoryIds);
    const categoryMap = new Map<number, string>();
    categories.forEach((category) =>
      categoryMap.set(category.id, category.name),
    );

    const response: InventoryItemMonitoringResponseDto[] = nomenclatures.map(
      (nomenclature) => {
        let sum = 0;
        const inventoryItemResponse: InventoryItemData[] = warehouses.map(
          (warehouse) => {
            const quantity =
              inventoryMap.get(nomenclature.id)?.get(warehouse.id) || null;
            if (quantity) {
              sum += quantity;
            }
            return {
              warehouseName: warehouse.name,
              quantity: quantity,
            };
          },
        );

        return {
          nomenclatureId: nomenclature.id,
          nomenclatureName: nomenclature.name,
          categoryName: categoryMap.get(nomenclature.categoryId),
          measurement: nomenclature.measurement,
          sum: sum,
          inventoryItems: inventoryItemResponse,
        };
      },
    );

    return response.filter((result) => result.sum > 0);
  }
}
