import {
  WarehouseDocumentDetail as PrismaWarehouseDocumentDetail,
  Prisma,
} from '@prisma/client';
import { WarehouseDocumentDetail } from '@warehouse/document/documentDetail/domain/warehouseDocumentDetail';
import {
  InventoryMetaDataType,
  MovingMetaDataType,
} from '@warehouse/document/documentDetail/interface/warehouseDocumentType';

export class PrismaWarehouseDocumentDetailMapper {
  static toDomain(
    entity: PrismaWarehouseDocumentDetail,
  ): WarehouseDocumentDetail {
    if (!entity) {
      return null;
    }

    let parsedMetaData: InventoryMetaDataType | MovingMetaDataType | undefined;

    if (typeof entity.metaData === 'object' && entity.metaData !== null) {
      parsedMetaData = entity.metaData as unknown as
        | InventoryMetaDataType
        | MovingMetaDataType;
    } else if (typeof entity.metaData === 'string') {
      try {
        parsedMetaData = JSON.parse(entity.metaData) as
          | InventoryMetaDataType
          | MovingMetaDataType;
      } catch (error) {
        parsedMetaData = undefined;
      }
    }

    return new WarehouseDocumentDetail({
      id: entity.id,
      warehouseDocumentId: entity.warehouseDocumentId,
      nomenclatureId: entity.nomenclatureId,
      quantity: entity.quantity,
      comment: entity.comment,
      metaData: parsedMetaData,
    });
  }

  static toPrisma(
    warehouseDocumentDetail: WarehouseDocumentDetail,
  ): Prisma.WarehouseDocumentDetailUncheckedCreateInput {
    return {
      id: warehouseDocumentDetail.id,
      warehouseDocumentId: warehouseDocumentDetail.warehouseDocumentId,
      nomenclatureId: warehouseDocumentDetail.nomenclatureId,
      quantity: warehouseDocumentDetail.quantity,
      comment: warehouseDocumentDetail.comment,
      metaData: warehouseDocumentDetail.metaData
        ? JSON.stringify(warehouseDocumentDetail.metaData)
        : null,
    };
  }
}
