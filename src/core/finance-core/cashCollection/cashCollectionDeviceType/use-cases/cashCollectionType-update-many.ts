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
    const dataMap = new Map(data.map((d) => [d.cashCollectionDeviceTypeId, d]));
    const deviceMap = new Map(devices.map((d) => [d.id, d]));

    const cashSumMap = this.calculateDeviceTypeSums(
      cashCollectionDevices,
      deviceMap,
    );

    const cashCollectionDeviceTypes =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollectionId,
      );

    for (const cashCollectionDeviceType of cashCollectionDeviceTypes) {
      const sums = cashSumMap.get(
        cashCollectionDeviceType.carWashDeviceTypeId,
      ) || { sum: 0, virtSum: 0 };

      const cashData = dataMap.get(cashCollectionDeviceType.id);
      const sumCoin = cashData?.sumCoin ?? cashCollectionDeviceType.sumCoin;
      const sumPaper = cashData?.sumPaper ?? cashCollectionDeviceType.sumPaper;
      const sumFact = sumCoin + sumPaper;

      await this.updateCashCollectionTypeUseCase.execute(
        {
          sumFact,
          sumCoin,
          sumPaper,
          shortage: sums.sum - sumFact,
          virtualSum: sums.virtSum,
        },
        cashCollectionDeviceType,
      );
    }
  }

  private calculateDeviceTypeSums(
    cashCollectionDevices: CashCollectionDevice[],
    deviceMap: Map<number, CarWashDevice>,
  ): Map<number, { sum: number; virtSum: number }> {
    const cashSumMap = new Map<number, { sum: number; virtSum: number }>();

    for (const device of cashCollectionDevices) {
      const deviceInfo = deviceMap.get(device.carWashDeviceId);
      if (!deviceInfo) continue;

      const typeId = deviceInfo.carWashDeviceTypeId;
      const current = cashSumMap.get(typeId) || { sum: 0, virtSum: 0 };

      cashSumMap.set(typeId, {
        sum: current.sum + device.sum,
        virtSum: current.virtSum + device.virtualSum,
      });
    }

    return cashSumMap;
  }
}
