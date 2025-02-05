import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

export abstract class ICashCollectionDeviceTypeRepository {
  abstract create(
    input: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType>;
  abstract findOneById(id: number): Promise<CashCollectionDeviceType>;
}
