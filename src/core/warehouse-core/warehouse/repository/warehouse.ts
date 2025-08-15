import { Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { PrismaService } from '@db/prisma/prisma.service';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { PrismaWarehouseMapper } from '@db/mapper/prisma-warehouse-mapper';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class WarehouseRepository extends IWarehouseRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Warehouse): Promise<Warehouse> {
    const warehouseEntity = PrismaWarehouseMapper.toPrisma(input);
    const warehouse = await this.prisma.warehouse.create({
      data: warehouseEntity,
    });
    return PrismaWarehouseMapper.toDomain(warehouse);
  }

  public async findOneById(id: number): Promise<Warehouse> {
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        id,
      },
    });
    return PrismaWarehouseMapper.toDomain(warehouse);
  }

  public async findAllByPosId(
    posId: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      include: {
        manager: true,
      },
      where: {
        posId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return warehouses.map((item) => PrismaWarehouseMapper.toDomain(item));
  }

  public async findCountAllByPosId(posId: number): Promise<number> {
    return this.prisma.warehouse.count({
      where: {
        posId,
      },
    });
  }

  public async findAllByPermission(
    ability: any,
    placementId?: number,
    skip?: number,
    take?: number,
  ): Promise<Warehouse[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      include: {
        manager: true,
      },
      where: {
        AND: [
          accessibleBy(ability).Warehouse,
          placementId ? { pos: { placementId } } : {},
        ],
      },
      orderBy: {
        id: 'asc',
      },
    });
    return warehouses.map((item) => PrismaWarehouseMapper.toDomain(item));
  }

  public async findCountAllByPermission(
    ability: any,
    placementId?: number,
  ): Promise<number> {
    return this.prisma.warehouse.count({
      where: {
        AND: [
          accessibleBy(ability).Warehouse,
          placementId ? { pos: { placementId } } : {},
        ],
      },
    });
  }

  public async update(input: Warehouse): Promise<Warehouse> {
    const warehouseEntity = PrismaWarehouseMapper.toPrisma(input);
    const warehouse = await this.prisma.warehouse.update({
      where: {
        id: input.id,
      },
      data: warehouseEntity,
    });
    return PrismaWarehouseMapper.toDomain(warehouse);
  }
}
