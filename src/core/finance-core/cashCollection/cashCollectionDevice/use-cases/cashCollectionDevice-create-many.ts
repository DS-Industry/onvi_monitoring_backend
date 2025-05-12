import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceRepository } from '@finance/cashCollection/cashCollectionDevice/interface/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { FindMethodsDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-find-methods';
import { EVENT_TYPE_CASH_COLLECTION_ID } from '@constant/constants';
import { CalculateMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-calculate-methods';

@Injectable()
export class CreateManyCashCollectionDeviceUseCase {
  constructor(
    private readonly calculateMethodsCashCollectionUseCase: CalculateMethodsCashCollectionUseCase,
    private readonly cashCollectionDeviceRepository: ICashCollectionDeviceRepository,
    private readonly findMethodsDeviceEventUseCase: FindMethodsDeviceEventUseCase,
  ) {}

  async execute(
    cashCollectionId: number,
    devices: CarWashDevice[],
    oldCashCollectionId?: number,
  ): Promise<{ carCount: number; sumCard: number }> {
    const cashCollectionDevicesData: CashCollectionDevice[] = [];
    let carCount = 0;
    let sumCard = 0;

    const oldRecordsMap = new Map<number, Date>();
    if (oldCashCollectionId) {
      (
        await this.cashCollectionDeviceRepository.findAllByCashCollectionId(
          oldCashCollectionId,
        )
      ).forEach((device) =>
        oldRecordsMap.set(device.carWashDeviceId, device.tookMoneyTime),
      );
    }

    const yesterdayAt8AM = new Date();
    yesterdayAt8AM.setDate(yesterdayAt8AM.getDate() - 1);
    yesterdayAt8AM.setHours(8, 0, 0, 0);

    await Promise.all(
      devices.map(async (device) => {
        const lastEventDevice =
          await this.findMethodsDeviceEventUseCase.getLastEventByDeviceIdAndTypeId(
            device.id,
            EVENT_TYPE_CASH_COLLECTION_ID,
          );
        const {
          sumCoin,
          sumPaper,
          virtualSum,
          carCount: carCountDevice,
          sumCard: sumCardDevice,
        } = await this.calculateMethodsCashCollectionUseCase.calculateDeviceSumsAndOperations(
          device.id,
          oldRecordsMap.get(device.id) || yesterdayAt8AM,
          lastEventDevice?.eventDate || yesterdayAt8AM,
        );

        cashCollectionDevicesData.push(
          new CashCollectionDevice({
            cashCollectionId,
            carWashDeviceId: device.id,
            oldTookMoneyTime: oldRecordsMap.get(device.id) || yesterdayAt8AM,
            tookMoneyTime: lastEventDevice?.eventDate || yesterdayAt8AM,
            sum: sumCoin + sumPaper,
            sumCoin,
            sumPaper,
            carCount: carCountDevice,
            sumCard: sumCardDevice,
            virtualSum,
          }),
        );

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
