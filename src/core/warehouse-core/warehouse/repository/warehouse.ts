import { Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouse/warehouse/interface/warehouse';
import { PrismaService } from '@db/prisma/prisma.service';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';
import { PrismaWarehouseMapper } from '@db/mapper/prisma-warehouse-mapper';

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

  public async findAllByPosId(posId: number): Promise<Warehouse[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: {
        posId,
      },
    });
    return warehouses.map((item) => PrismaWarehouseMapper.toDomain(item));
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
