import { Injectable } from '@nestjs/common';
import { UpdateCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-update';
import { CashCollectionDeviceTypeDataDto } from '@finance/cashCollection/cashCollection/use-cases/dto/cashCollection-recalculate.dto';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';

@Injectable()
export class UpdateManyCashCollectionTypeUseCase {
  constructor(
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly updateCashCollectionTypeUseCase: UpdateCashCollectionTypeUseCase,
  ) {}

  async execute(
    cashCollectionId: number,
    data: CashCollectionDeviceTypeDataDto[],
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
  ): Promise<void> {
    const cashSumMap = new Map<number, { sum: number; virtSum: number }>();

    cashCollectionDevices.forEach((cashCollectionDevice) => {
      const device = devices.find(
        (d) => d.id === cashCollectionDevice.carWashDeviceId,
      );
      if (!device) return;

      const currentSum = cashSumMap.get(device.carWashDeviceTypeId) || {
        sum: 0,
        virtSum: 0,
      };
      cashSumMap.set(device.carWashDeviceTypeId, {
        sum: currentSum.sum + cashCollectionDevice.sum,
        virtSum: currentSum.virtSum + cashCollectionDevice.virtualSum,
      });
    });

    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollectionId,
      );

    await Promise.all(
      cashCollectionDeviceTypes.map(async (cashCollectionDeviceType) => {
        const sums = cashSumMap.get(
          cashCollectionDeviceType.carWashDeviceTypeId,
        ) || { sum: 0, virtSum: 0 };
        const cashData = data.find(
          (d) => d.cashCollectionDeviceTypeId === cashCollectionDeviceType.id,
        );
        const sumCoin = cashData?.sumCoin ?? cashCollectionDeviceType.sumCoin;
        const sumPaper =
          cashData?.sumPaper ?? cashCollectionDeviceType.sumPaper;

        const updatedData = {
          sumFact: sumCoin + sumPaper,
          sumCoin: sumCoin,
          sumPaper: sumPaper,
          shortage: sums.sum - (sumCoin + sumPaper),
          virtualSum: sums.virtSum,
        };

        await this.updateCashCollectionTypeUseCase.execute(
          updatedData,
          cashCollectionDeviceType,
        );
      }),
    );
  }
}
