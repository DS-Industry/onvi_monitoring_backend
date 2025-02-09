import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

export abstract class ICashCollectionDeviceTypeRepository {
  abstract create(
    input: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType>;
  abstract createMany(input: CashCollectionDeviceType[]): Promise<any>;
  abstract findOneById(id: number): Promise<CashCollectionDeviceType>;
  abstract findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDeviceType[]>;
  abstract update(
    input: CashCollectionDeviceType,
  ): Promise<CashCollectionDeviceType>;
}
