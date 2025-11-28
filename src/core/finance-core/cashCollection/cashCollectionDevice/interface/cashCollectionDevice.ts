import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CashCollectionDeviceCalculateResponseDto } from '@finance/cashCollection/cashCollectionDevice/use-cases/dto/cashCollectionDevice-calculate-response.dto';

export abstract class ICashCollectionDeviceRepository {
  abstract create(input: CashCollectionDevice): Promise<CashCollectionDevice>;
  abstract createMany(input: CashCollectionDevice[]): Promise<any>;
  abstract findOneById(id: number): Promise<CashCollectionDevice>;
  abstract findAllByCashCollectionId(
    cashCollectionId: number,
  ): Promise<CashCollectionDevice[]>;
  abstract findCalculateData(
    deviceIds: number[],
  ): Promise<CashCollectionDeviceCalculateResponseDto[]>;
  abstract findRecalculateDataByDevice(
    cashCollectionDeviceId: number,
    tookMoneyTime: Date,
    oldTookMoneyTime?: Date,
  ): Promise<CashCollectionDeviceCalculateResponseDto>;
  abstract update(input: CashCollectionDevice): Promise<CashCollectionDevice>;
}
