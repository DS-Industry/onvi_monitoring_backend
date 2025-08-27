import { MNGSalePrice as PrismaSalePrice, Prisma } from '@prisma/client';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';

export class PrismaSalePriceMapper {
  static toDomain(entity: PrismaSalePrice): SalePrice {
    if (!entity) {
      return null;
    }
    const salePriceProps = new SalePrice({
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      warehouseId: entity.warehouseId,
      price: entity.price,
    });
    return <SalePrice>salePriceProps.getProps();
  }

  static toPrisma(
    salePrice: SalePrice,
  ): Prisma.MNGSalePriceUncheckedCreateInput {
    return {
      id: salePrice?.id,
      nomenclatureId: salePrice.nomenclatureId,
      warehouseId: salePrice.warehouseId,
      price: salePrice.price,
    };
  }
}
