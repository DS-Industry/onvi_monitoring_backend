import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';

export abstract class ICashCollectionDeviceRepository {
  abstract create(input: CashCollectionDevice): Promise<CashCollectionDevice>;
  abstract findOneById(id: number): Promise<CashCollectionDevice>;
}
