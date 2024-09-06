import { Provider } from '@nestjs/common';
import { ICurrencyRepository } from '@device/currency/currency/interface/currency';
import { CurrencyRepository } from '@device/currency/currency/repository/currency';

export const CurrencyRepositoryProvide: Provider = {
  provide: ICurrencyRepository,
  useClass: CurrencyRepository,
};
