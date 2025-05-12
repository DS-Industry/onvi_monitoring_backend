import { Provider } from '@nestjs/common';
import { ICurrencyRepository } from '@pos/device/device-data/currency/currency/interface/currency';
import { CurrencyRepository } from '@pos/device/device-data/currency/currency/repository/currency';

export const CurrencyRepositoryProvide: Provider = {
  provide: ICurrencyRepository,
  useClass: CurrencyRepository,
};
