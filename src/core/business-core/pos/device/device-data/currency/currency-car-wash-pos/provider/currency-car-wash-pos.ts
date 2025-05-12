import { Provider } from '@nestjs/common';
import { ICurrencyCarWashPosRepository } from '@pos/device/device-data/currency/currency-car-wash-pos/interface/currency-car-wash-pos';
import { CurrencyCarWashPosRepository } from '@pos/device/device-data/currency/currency-car-wash-pos/repository/currency-car-wash-pos';

export const CurrencyCarWashPosRepositoryProvider: Provider = {
  provide: ICurrencyCarWashPosRepository,
  useClass: CurrencyCarWashPosRepository,
};
