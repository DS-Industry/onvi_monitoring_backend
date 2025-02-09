import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';

export abstract class ICashCollectionDeviceRepository {
  abstract create(input: CashCollectionDevice): Promise<CashCollectionDevice>;
  abstract createMany(input: CashCollectionDevice[]): Promise<any>;
  abstract findOneById(id: number): Promise<CashCollectionDevice>;
  abstract findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDevice[]>;
  abstract update(input: CashCollectionDevice): Promise<CashCollectionDevice>;
}
