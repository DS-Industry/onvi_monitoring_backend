import { MNGSaleDocument as PrismaSaleDocument, Prisma } from '@prisma/client';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';

export class PrismaSaleDocumentMapper {
  static toDomain(entity: PrismaSaleDocument): SaleDocument {
    if (!entity) {
      return null;
    }
    return new SaleDocument({
      id: entity.id,
      warehouseId: entity.warehouseId,
      responsibleManagerId: entity.responsibleManagerId,
      saleDate: entity.saleDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    saleDocument: SaleDocument,
  ): Prisma.MNGSaleDocumentUncheckedCreateInput {
    return {
      id: saleDocument?.id,
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
