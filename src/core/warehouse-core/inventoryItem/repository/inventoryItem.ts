import { Injectable } from '@nestjs/common';
import { IInventoryItemRepository } from '@warehouse/inventoryItem/interface/inventoryItem';
import { PrismaService } from '@db/prisma/prisma.service';
import { InventoryItem } from '@warehouse/inventoryItem/domain/inventoryItem';
import { PrismaInventoryItemMapper } from '@db/mapper/prisma-inventory-item-mapper';
import { NomenclatureStatus } from '@prisma/client';

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

  public async findAllByWarehouseIdsForInventory(
    warehouseIds: number[],
    organizationId?: number,
    categoryId?: number,
    status?: NomenclatureStatus,
    skip?: number,
    take?: number,
  ): Promise<InventoryItem[]> {
    const where: any = {};

    where.warehouseId = { in: warehouseIds };

    where.quantity = { gt: 0 };

    if (organizationId !== undefined) {
      where.nomenclature = { organizationId };
    }

    if (categoryId !== undefined) {
      where.nomenclature = { categoryId };
    }

    if (status !== undefined) {
      where.nomenclature = { status };
    }

    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: where,
      distinct: ['nomenclatureId'],
      orderBy: {
        nomenclatureId: 'asc',
      },
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
    return inventoryItems.map((item) =>
      PrismaInventoryItemMapper.toDomain(item),
    );
  }

  public async findCountByWarehouseIdsForInventory(
    warehouseIds: number[],
    organizationId?: number,
    categoryId?: number,
    status?: NomenclatureStatus,
  ): Promise<number> {
    const where: any = {};

    where.warehouseId = { in: warehouseIds };

    where.quantity = { gt: 0 };

    if (organizationId !== undefined) {
      where.nomenclature = { organizationId };
    }

    if (categoryId !== undefined) {
      where.nomenclature = { categoryId };
    }

    if (status !== undefined) {
      where.nomenclature = { status };
    }

    const result = await this.prisma.inventoryItem.groupBy({
      by: ['nomenclatureId'],
      where: where,
      _count: {
        _all: true,
      },
    });

    return result.length;
  }

  public async findAllByNomenclatureIdsAndWarehouseIds(
    nomenclatureIds: number[],
    warehouseIds: number[],
  ): Promise<InventoryItem[]> {
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: {
        warehouseId: { in: warehouseIds },
        nomenclatureId: { in: nomenclatureIds },
      },
    });
    return inventoryItems.map((item) =>
      PrismaInventoryItemMapper.toDomain(item),
    );
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

  public async updateMany(input: InventoryItem[]): Promise<void> {
    const updates = input.map((item) => {
      return this.prisma.inventoryItem.update({
        where: { id: item.id },
        data: PrismaInventoryItemMapper.toPrisma(item),
      });
    });

    await this.prisma.$transaction(updates);
  }

  public async createMany(input: InventoryItem[]): Promise<InventoryItem[]> {
    const inventoryItemEntities = input.map((item) =>
      PrismaInventoryItemMapper.toPrisma(item),
    );
    const inventoryItems = await this.prisma.inventoryItem.createMany({
      data: inventoryItemEntities,
    });
    return input;
  }
}
