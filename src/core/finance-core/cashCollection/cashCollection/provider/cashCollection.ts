import { Provider } from '@nestjs/common';
import { ICashCollectionRepository } from '@finance/cashCollection/cashCollection/interface/cashCollection';
import { CashCollectionRepository } from '@finance/cashCollection/cashCollection/repository/cashCollection';

export const CashCollectionRepositoryProvider: Provider = {
  provide: ICashCollectionRepository,
  useClass: CashCollectionRepository,
};
