import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-find-methods';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';
import { FindMethodsDeviceOperationCardUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods';
import {
  CarWashDevice,
  CashCollectionDevice,
  CurrencyView,
} from '@prisma/client';

@Injectable()
export class CalculateMethodsCashCollectionUseCase {
  constructor(
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsDeviceEventUseCase: FindMethodsDeviceEventUseCase,
    private readonly countCarDeviceProgramUseCase: CountCarDeviceProgramUseCase,
    private readonly findMethodsDeviceOperationCardUseCase: FindMethodsDeviceOperationCardUseCase,
  ) {}

  async calculateDeviceSumsAndOperations(
    deviceId: number,
    oldTookMoneyTime: Date,
    newTookMoneyTime: Date,
  ): Promise<{
    sumCoin: number;
    sumPaper: number;
    virtualSum: number;
    carCount: number;
    sumCard: number;
  }> {
    const [deviceOperations, deviceOperationCards, carCount] =
      await Promise.all([
        this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
          deviceId,
          oldTookMoneyTime,
          newTookMoneyTime,
        ),
        this.findMethodsDeviceOperationCardUseCase.getAllByDeviceIdAndDateUseCase(
          deviceId,
          oldTookMoneyTime,
          newTookMoneyTime,
        ),
        this.countCarDeviceProgramUseCase.execute(
          deviceId,
          oldTookMoneyTime,
          newTookMoneyTime,
        ),
      ]);

    let sumCoin = 0;
    let sumPaper = 0;
    let virtualSum = 0;
    let sumCard = 0;

    for (const operation of deviceOperations) {
      if (operation.currencyView === CurrencyView.COIN) {
        sumCoin += operation.operSum;
      } else if (operation.currencyView === CurrencyView.PAPER) {
        sumPaper += operation.operSum;
      } else {
        virtualSum += operation.operSum;
      }
    }

    sumCard = deviceOperationCards.reduce((acc, card) => acc + card.sum, 0);

    return { sumCoin, sumPaper, virtualSum, carCount, sumCard };
  }

  async calculateDeviceTypeSums(
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
  ): Promise<Map<number, { sum: number; virtSum: number }>> {
    const cashSumMap = new Map<number, { sum: number; virtSum: number }>();

    for (const cashCollectionDevice of cashCollectionDevices) {
      const device = devices.find((d) => d.id === cashCollectionDevice.carWashDeviceId);
      if (!device) continue;

      const currentSum = cashSumMap.get(device.carWashDeviceTypeId) || { sum: 0, virtSum: 0 };
      cashSumMap.set(device.carWashDeviceTypeId, {
        sum: currentSum.sum + cashCollectionDevice.sum,
        virtSum: currentSum.virtSum + cashCollectionDevice.virtualSum,
      });
    }

    return cashSumMap;
  }
}
