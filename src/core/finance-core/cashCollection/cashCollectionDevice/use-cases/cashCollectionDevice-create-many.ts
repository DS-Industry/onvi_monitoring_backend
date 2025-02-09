import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-find-methods';
import { CurrencyView } from '@prisma/client';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';
import { FindMethodsDeviceOperationCardUseCase } from '@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods';

@Injectable()
export class CreateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsDeviceEventUseCase: FindMethodsDeviceEventUseCase,
    private readonly countCarDeviceProgramUseCase: CountCarDeviceProgramUseCase,
    private readonly findMethodsDeviceOperationCardUseCase: FindMethodsDeviceOperationCardUseCase,
  ) {}

  async execute(
    cashCollectionId: number,
    devices: CarWashDevice[],
    oldCashCollectionId?: number,
  ): Promise<{ carCount: number; sumCard: number }> {
    const cashCollectionDevicesData: CashCollectionDevice[] = [];
    const sumCoinMap = new Map<number, number>();
    const sumPaperMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();
    let carCount = 0;
    let sumCard = 0;

    let oldRecordsMap = new Map<number, Date>();
    if (oldCashCollectionId) {
      const oldCashCollectionDevices =
        await this.cashCollectionDeviceRepository.findAllByCashCollectionId(
          oldCashCollectionId,
        );

      oldRecordsMap = new Map(
        oldCashCollectionDevices.map((cashCollectionDevice) => [
          cashCollectionDevice.carWashDeviceId,
          cashCollectionDevice.tookMoneyTime,
        ]),
      );
    }

    const yesterdayAt8AM = new Date();
    yesterdayAt8AM.setDate(yesterdayAt8AM.getDate() - 1);
    yesterdayAt8AM.setHours(8, 0, 0, 0);

    await Promise.all(
      devices.map(async (device) => {
        const lastEventDevice =
          await this.findMethodsDeviceEventUseCase.getLastEventByDeviceId(
            device.id,
          );
        const deviceOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
            device.id,
            oldRecordsMap.get(device.id) || yesterdayAt8AM,
            lastEventDevice.eventDate,
          );
        await Promise.all(
          deviceOperations.map(async (deviceOperation) => {
            const operSum = deviceOperation.operSum;
            const deviceId = deviceOperation.carWashDeviceId;

            if (deviceOperation.currencyView == CurrencyView.COIN) {
              sumCoinMap.set(
                deviceId,
                (sumCoinMap.get(deviceId) || 0) + operSum,
              );
            } else if (deviceOperation.currencyView == CurrencyView.PAPER) {
              sumPaperMap.set(
                deviceId,
                (sumPaperMap.get(deviceId) || 0) + operSum,
              );
            } else {
              virtualSumMap.set(
                deviceId,
                (virtualSumMap.get(deviceId) || 0) + operSum,
              );
            }
          }),
        );

        const sumCoin = sumCoinMap.get(device.id) || 0;
        const sumPaper = sumPaperMap.get(device.id) || 0;
        const virtualSum = virtualSumMap.get(device.id) || 0;

        const carCountDevice = await this.countCarDeviceProgramUseCase.execute(
          device.id,
          oldRecordsMap.get(device.id) || yesterdayAt8AM,
          lastEventDevice.eventDate,
        );
        const deviceOperationCards =
          await this.findMethodsDeviceOperationCardUseCase.getAllByDeviceIdAndDateUseCase(
            device.id,
            oldRecordsMap.get(device.id) || yesterdayAt8AM,
            lastEventDevice.eventDate,
          );
        const sumCardDevice = deviceOperationCards.reduce(
          (acc, card) => acc + card.sum,
          0,
        );
        const cashCollectionDeviceData = new CashCollectionDevice({
          cashCollectionId: cashCollectionId,
          carWashDeviceId: device.id,
          oldTookMoneyTime: oldRecordsMap.get(device.id) || yesterdayAt8AM,
          tookMoneyTime: lastEventDevice.eventDate,
          sum: sumCoin + sumPaper,
          sumCoin: sumCoin,
          sumPaper: sumPaper,
          carCount: carCountDevice,
          sumCard: sumCardDevice,
          virtualSum: virtualSum,
        });
        cashCollectionDevicesData.push(cashCollectionDeviceData);

        carCount += carCountDevice;
        sumCard += sumCardDevice;
      }),
    );
    await this.cashCollectionDeviceRepository.createMany(
      cashCollectionDevicesData,
    );
    return { carCount, sumCard };
  }
}
