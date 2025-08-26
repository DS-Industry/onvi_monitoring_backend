import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { NomenclatureStatus } from '@prisma/client';

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

  async getAllByWarehouseIdsForInventory(data: {
    warehouseIds: number[];
    organizationId?: number;
    categoryId?: number;
    status?: NomenclatureStatus;
    skip?: number;
    take?: number;
  }): Promise<InventoryItem[]> {
    return await this.inventoryItemRepository.findAllByWarehouseIdsForInventory(
      data.warehouseIds,
      data.organizationId,
      data.categoryId,
      data.status,
      data.skip,
      data.take,
    );
  }

  async getCountByWarehouseIdsForInventory(data: {
    warehouseIds: number[];
    organizationId?: number;
    categoryId?: number;
    status?: NomenclatureStatus;
  }): Promise<number> {
    return await this.inventoryItemRepository.findCountByWarehouseIdsForInventory(
      data.warehouseIds,
      data.organizationId,
      data.categoryId,
      data.status,
    );
  }
}
