import { MNGSaleItem as PrismaSaleItem, Prisma } from '@prisma/client';
import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';

export class PrismaSaleItemMapper {
  static toDomain(entity: PrismaSaleItem): SaleItem {
    if (!entity) {
      return null;
    }
    return new SaleItem({
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      mngSaleDocumentId: entity.mngSaleDocumentId,
      count: entity.count,
    });
  }

  static toPrisma(saleItem: SaleItem): Prisma.MNGSaleItemUncheckedCreateInput {
    return {
      id: saleItem?.id,
      nomenclatureId: saleItem.nomenclatureId,
      mngSaleDocumentId: saleItem.mngSaleDocumentId,
      count: saleItem.count,
    };
  }
}
