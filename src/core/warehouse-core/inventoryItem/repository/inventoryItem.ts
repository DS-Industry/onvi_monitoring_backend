import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { PrismaService } from '@db/prisma/prisma.service';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { PrismaInventoryItemMapper } from '@db/mapper/prisma-inventory-item-mapper';

@Injectable()
export class InventoryItemRepository extends IInventoryItemRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: InventoryItem): Promise<InventoryItem> {
    const inventoryItemEntity = PrismaInventoryItemMapper.toPrisma(input);
    const inventoryItem = await this.prisma.inventoryItem.create({
      data: inventoryItemEntity,
    });
    return PrismaInventoryItemMapper.toDomain(inventoryItem);
  }

  public async findOneById(id: number): Promise<InventoryItem> {
    const inventoryItem = await this.prisma.inventoryItem.findFirst({
      where: {
        id,
      },
    });
    return PrismaInventoryItemMapper.toDomain(inventoryItem);
  }

  public async findAllByNomenclatureId(
    nomenclatureId: number,
  ): Promise<InventoryItem[]> {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: {
        nomenclatureId,
      },
    });
    return inventoryItems.map((item) =>
      PrismaInventoryItemMapper.toDomain(item),
    );
  }

  public async findAllByWarehouseId(
    warehouseId: number,
  ): Promise<InventoryItem[]> {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: {
        warehouseId,
      },
    });
    return inventoryItems.map((item) =>
      PrismaInventoryItemMapper.toDomain(item),
    );
  }

  public async findOneByNomenclatureIdAndWarehouseId(
    nomenclatureId: number,
    warehouseId: number,
  ): Promise<InventoryItem> {
    const inventoryItem = await this.prisma.inventoryItem.findFirst({
      where: {
        nomenclatureId,
        warehouseId,
      },
    });
    return PrismaInventoryItemMapper.toDomain(inventoryItem);
  }

  public async update(input: InventoryItem): Promise<InventoryItem> {
    const inventoryItemEntity = PrismaInventoryItemMapper.toPrisma(input);
    const inventoryItem = await this.prisma.inventoryItem.update({
      where: {
        id: input.id,
      },
      data: inventoryItemEntity,
    });
    return PrismaInventoryItemMapper.toDomain(inventoryItem);
  }
}
