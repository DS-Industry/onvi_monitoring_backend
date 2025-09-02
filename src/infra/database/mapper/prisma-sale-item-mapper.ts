import { MNGSaleItem as PrismaSaleItem, Prisma } from '@prisma/client';
import { SaleItem } from '@warehouse/sale/MNGSaleItem/domain/saleItem';
import { SaleItemResponseDto } from '@warehouse/sale/MNGSaleItem/use-cases/dto/saleItem-response.dto';
export type PrismaSaleItemWithNomenclature = Prisma.MNGSaleItemGetPayload<{
  include: { nomenclature: true };
}>;
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
      fullSum: entity.fullSum,
    });
  }

  static toDomainWhitNomenclatureName(
    entity: PrismaSaleItemWithNomenclature,
  ): SaleItemResponseDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      nomenclatureName: entity.nomenclature.name,
      mngSaleDocumentId: entity.mngSaleDocumentId,
      count: entity.count,
      fullSum: entity.fullSum,
    };
  }
  static toPrisma(saleItem: SaleItem): Prisma.MNGSaleItemUncheckedCreateInput {
    return {
      id: saleItem?.id,
      nomenclatureId: saleItem.nomenclatureId,
      mngSaleDocumentId: saleItem.mngSaleDocumentId,
      count: saleItem.count,
      fullSum: saleItem.fullSum,
    };
  }
}
