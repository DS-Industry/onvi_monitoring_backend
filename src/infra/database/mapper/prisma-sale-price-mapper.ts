import { MNGSalePrice as PrismaSalePrice, Prisma } from '@prisma/client';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { SalePriceResponseDto } from '@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-response.dto';
export type PrismaSalePriceWithNomenclature = Prisma.MNGSalePriceGetPayload<{
  include: { nomenclature: true };
}>;
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

  static toDomainWhitNomenclatureName(
    entity: PrismaSalePriceWithNomenclature,
  ): SalePriceResponseDto {
    if (!entity) {
      return null;
    }
    return {
      id: entity.id,
      nomenclatureId: entity.nomenclatureId,
      nomenclatureName: entity.nomenclature.name,
      warehouseId: entity.warehouseId,
      price: entity.price,
    };
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
