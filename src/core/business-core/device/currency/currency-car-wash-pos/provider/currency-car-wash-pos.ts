import { Provider } from '@nestjs/common';
import { ICurrencyCarWashPosRepository } from '@device/currency/currency-car-wash-pos/interface/currency-car-wash-pos';
import { CurrencyCarWashPosRepository } from '@device/currency/currency-car-wash-pos/repository/currency-car-wash-pos';

export const CurrencyCarWashPosRepositoryProvider: Provider = {
  provide: ICurrencyCarWashPosRepository,
  useClass: CurrencyCarWashPosRepository,
};
