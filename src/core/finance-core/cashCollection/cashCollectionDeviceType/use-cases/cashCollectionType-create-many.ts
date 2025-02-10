import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';
import { CalculateMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-calculate-methods';

@Injectable()
export class CreateManyCashCollectionTypeUseCase {
  constructor(
    private readonly calculateMethodsCashCollectionUseCase: CalculateMethodsCashCollectionUseCase,
    private readonly cashCollectionDeviceTypeRepository: ICashCollectionDeviceTypeRepository,
  ) {}

  async execute(
    cashCollectionId: number,
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
  ): Promise<void> {
    const cashSumMap =
      await this.calculateMethodsCashCollectionUseCase.calculateDeviceTypeSums(
        cashCollectionDevices,
        devices,
      );

    const cashCollectionTypeData = Array.from(cashSumMap.entries()).map(
      ([typeId, sums]) =>
        new CashCollectionDeviceType({
          cashCollectionId,
          carWashDeviceTypeId: typeId,
          carWashDeviceTypeName:
            devices.find((d) => d.carWashDeviceTypeId === typeId)
              ?.carWashDeviceTypeName || '',
          sumFact: 0,
          sumCoin: 0,
          sumPaper: 0,
          shortage: sums.sum,
          virtualSum: sums.virtSum,
        }),
    );

    await this.cashCollectionDeviceTypeRepository.createMany(
      cashCollectionTypeData,
    );
  }
}
