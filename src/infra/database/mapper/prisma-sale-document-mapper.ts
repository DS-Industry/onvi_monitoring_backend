import { MNGSaleDocument as PrismaSaleDocument, Prisma } from '@prisma/client';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { SaleDocumentResponseDto } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-response.dto';
export type PrismaSaleDocumentWithData = Prisma.MNGSaleDocumentGetPayload<{
  include: {
    warehouse: true;
    responsibleManager: true;
  };
}>;
export class PrismaSaleDocumentMapper {
  static toDomain(entity: PrismaSaleDocument): SaleDocument {
    if (!entity) {
      return null;
    }
    const saleDocument = new SaleDocument({
      id: entity.id,
      name: entity.name,
      warehouseId: entity.warehouseId,
      responsibleManagerId: entity.responsibleManagerId,
      saleDate: entity.saleDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
    return <SaleDocument>saleDocument.getProps();
  }

  static toDomainWithData(
    entity: PrismaSaleDocumentWithData,
  ): SaleDocumentResponseDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      name: entity.name,
      warehouseId: entity.warehouseId,
      warehouseName: entity.warehouse.name,
      responsibleManagerId: entity.responsibleManagerId,
      responsibleManagerName:
        entity.responsibleManager.surname +
        ' ' +
        entity.responsibleManager.name,
      saleDate: entity.saleDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    };
  }

  static toPrisma(
    saleDocument: SaleDocument,
  ): Prisma.MNGSaleDocumentUncheckedCreateInput {
    return {
      id: saleDocument?.id,
      name: saleDocument.name,
      warehouseId: saleDocument.warehouseId,
      responsibleManagerId: saleDocument.responsibleManagerId,
      saleDate: saleDocument.saleDate,
      createdAt: saleDocument.createdAt,
      updatedAt: saleDocument.updatedAt,
      createdById: saleDocument.createdById,
      updatedById: saleDocument.updatedById,
    };
  }
}
