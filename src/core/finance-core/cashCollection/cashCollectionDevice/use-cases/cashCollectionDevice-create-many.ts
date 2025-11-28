import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';

@Injectable()
export class CreateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
  ) {}

  async execute(
    cashCollectionId: number,
    devices: CarWashDevice[],
  ): Promise<{ carCount: number; sumCard: number }> {
    const deviceIds = devices.map((device) => device.id);

    const calculateData =
      await this.findMethodsCashCollectionDeviceUseCase.getCalculateData(
        deviceIds,
      );

    const cashCollectionDevicesData: CashCollectionDevice[] = [];
    let totalCarCount = 0;
    let totalSumCard = 0;

    calculateData.forEach((data) => {
      cashCollectionDevicesData.push(
        new CashCollectionDevice({
          cashCollectionId,
          carWashDeviceId: data.deviceId,
          oldTookMoneyTime: data.oldTookMoneyTime,
          tookMoneyTime: data.tookMoneyTime,
          sum: data.sumCoin + data.sumPaper,
          sumCoin: data.sumCoin,
          sumPaper: data.sumPaper,
          carCount: data.carCount,
          sumCard: data.sumCard,
          virtualSum: data.virtualSum,
        }),
      );

      totalCarCount += data.carCount;
      totalSumCard += data.sumCard;
    });

    await this.cashCollectionDeviceRepository.createMany(
      cashCollectionDevicesData,
    );

    return {
      carCount: totalCarCount,
      sumCard: totalSumCard,
    };
  }
}
