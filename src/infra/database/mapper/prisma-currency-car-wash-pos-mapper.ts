import {
  CurrencyCarWashPos as PrismaCurrencyCarWashPos,
  Prisma,
} from '@prisma/client';
import { CurrencyCarWashPos } from '@device/currency/currency-car-wash-pos/domain/currency-car-wash-pos';

export class PrismaCurrencyCarWashPosMapper {
  static toDomain(entity: PrismaCurrencyCarWashPos): CurrencyCarWashPos {
    if (!entity) {
      return null;
    }
    return new CurrencyCarWashPos({
      id: entity.id,
      currencyId: entity.id,
      carWashDeviceTypeId: entity.carWashDeviceTypeId,
      coef: entity.coef,
      carWashPosId: entity.carWashPosId,
    });
  }

  static toPrisma(
    currencyCarWashPos: CurrencyCarWashPos,
  ): Prisma.CurrencyCarWashPosUncheckedCreateInput {
    return {
      id: currencyCarWashPos?.id,
      currencyId: currencyCarWashPos.currencyId,
      carWashDeviceTypeId: currencyCarWashPos.carWashDeviceTypeId,
      coef: currencyCarWashPos.coef,
      carWashPosId: currencyCarWashPos.carWashPosId,
    };
  }
}
