import { Provider } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { CashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/repository/cashCollectionDeviceType';

export const CashCollectionDeviceTypeRepositoryProvider: Provider = {
  provide: ICashCollectionDeviceTypeRepository,
  useClass: CashCollectionDeviceTypeRepository,
};
