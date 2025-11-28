import { Warehouse as PrismaWarehouse, Prisma, User } from '@prisma/client';
import { Warehouse } from '@warehouse/warehouse/domain/warehouse';

export class PrismaWarehouseMapper {
  static toDomain(entity: PrismaWarehouse & { manager?: User }): Warehouse {
    if (!entity) {
      return null;
    }
    return new Warehouse({
      id: entity.id,
      name: entity.name,
      location: entity.location,
      managerId: entity.managerId,
      managerName:
        entity.manager?.name + ' ' + entity.manager?.surname ?? undefined,
      posId: entity.posId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
    });
  }

  static toPrisma(warehouse: Warehouse): Prisma.WarehouseUncheckedCreateInput {
    return {
      id: warehouse?.id,
      name: warehouse.name,
      location: warehouse.location,
      managerId: warehouse.managerId,
      posId: warehouse.posId,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
      createdById: warehouse.createdById,
      updateById: warehouse.updatedById,
    };
  }
}
