import { Currency as PrismaCurrency, Prisma } from '@prisma/client';
import { Currency } from '@device/currency/currency/domain/currency';

export class PrismaCurrencyMapper {
  static toDomain(entity: PrismaCurrency): Currency {
    if (!entity) {
      return null;
    }
    return new Currency({
      id: entity.id,
      code: entity.code,
      name: entity.name,
      currencyView: entity.currencyView,
      currencyType: entity.currencyType,
    });
  }

  static toPrisma(currency: Currency): Prisma.CurrencyUncheckedCreateInput {
    return {
      id: currency?.id,
      code: currency.code,
      name: currency.name,
      currencyType: currency.currencyType,
      currencyView: currency.currencyView,
    };
  }
}
