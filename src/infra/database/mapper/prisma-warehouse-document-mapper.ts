import {
  WarehouseDocument as PrismaWarehouseDocument,
  Prisma,
  User,
  Warehouse,
} from '@prisma/client';
import { WarehouseDocument } from '@warehouse/document/document/domain/warehouseDocument';

export class PrismaWarehouseDocumentMapper {
  static toDomain(
    entity: PrismaWarehouseDocument & {
      responsible?: User;
      warehouse?: Warehouse;
    },
  ): WarehouseDocument {
    if (!entity) {
      return null;
    }
    return new WarehouseDocument({
      id: entity.id,
      name: entity.name,
      type: entity.warehouseDocumentType,
      warehouseId: entity.warehouseId,
      warehouseName: entity.warehouse?.name ?? undefined,
      responsibleId: entity.responsibleId,
      responsibleName:
        entity.responsible?.name + ' ' + entity.responsible?.surname ??
        undefined,
      status: entity.status,
      carryingAt: entity.carryingAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
    });
  }

  static toPrisma(
    warehouseDocument: WarehouseDocument,
  ): Prisma.WarehouseDocumentUncheckedCreateInput {
    return {
      id: warehouseDocument?.id,
      name: warehouseDocument.name,
      warehouseDocumentType: warehouseDocument.type,
      status: warehouseDocument.status,
      warehouseId: warehouseDocument?.warehouseId,
      responsibleId: warehouseDocument?.responsibleId,
      carryingAt: warehouseDocument.carryingAt,
      createdAt: warehouseDocument.createdAt,
      updatedAt: warehouseDocument.updatedAt,
      createdById: warehouseDocument.createdById,
      updateById: warehouseDocument.updatedById,
    };
  }
}
