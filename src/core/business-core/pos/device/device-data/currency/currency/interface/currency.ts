import { Currency } from '@pos/device/device-data/currency/currency/domain/currency';

export abstract class ICurrencyRepository {
  abstract create(input: Currency): Promise<Currency>;
  abstract findOneById(id: number): Promise<Currency>;
  abstract findOneByCode(code: string): Promise<Currency>;
  abstract findOneByName(name: string): Promise<Currency>;
}
