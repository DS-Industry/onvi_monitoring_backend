import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';

@Injectable()
export class FindMethodsInventoryItemUseCase {
  constructor(
    private readonly inventoryItemRepository: IInventoryItemRepository,
  ) {}

  async getById(input: number): Promise<InventoryItem> {
    return await this.inventoryItemRepository.findOneById(input);
  }

  async getAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<InventoryItem[]> {
    return await this.inventoryItemRepository.findAllByNomenclatureId(
      nomenclatureId,
    );
  }

  async getAllByWarehouseId(warehouseId: number): Promise<InventoryItem[]> {
    return await this.inventoryItemRepository.findAllByWarehouseId(warehouseId);
  }

  async getOneByNomenclatureIdAndWarehouseId(
    nomenclatureId: number,
    warehouseId: number,
  ): Promise<InventoryItem> {
    return await this.inventoryItemRepository.findOneByNomenclatureIdAndWarehouseId(
      nomenclatureId,
      warehouseId,
    );
  }

  async getAllByNomenclatureIdsAndWarehouseIds(
    nomenclatureIds: number[],
    warehouseIds: number[],
  ): Promise<InventoryItem[]> {
    return await this.inventoryItemRepository.findAllByNomenclatureIdsAndWarehouseIds(
      nomenclatureIds,
      warehouseIds,
    );
  }
}
