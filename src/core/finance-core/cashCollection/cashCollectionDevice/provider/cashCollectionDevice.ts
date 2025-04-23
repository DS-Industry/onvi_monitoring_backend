import { Provider } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/repository/cashCollectionDevice';

export const CashCollectionDeviceRepositoryProvider: Provider = {
  provide: ICashCollectionDeviceRepository,
  useClass: CashCollectionDeviceRepository,
};
