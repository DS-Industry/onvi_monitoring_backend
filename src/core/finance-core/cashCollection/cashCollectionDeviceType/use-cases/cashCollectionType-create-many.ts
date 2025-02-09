import { Injectable } from '@nestjs/common';
import { ICashCollectionDeviceTypeRepository } from '@finance/cashCollection/cashCollectionDeviceType/interface/cashCollectionDeviceType';
import { CashCollectionDevice } from '@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDeviceType } from '@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType';

@Injectable()
export class CreateManyCashCollectionTypeUseCase {
  constructor(
    private readonly cashCollectionDeviceTypeRepository: ICashCollectionDeviceTypeRepository,
  ) {}

  async execute(
    cashCollectionId: number,
    cashCollectionDevices: CashCollectionDevice[],
    devices: CarWashDevice[],
  ): Promise<any> {
    const cashCollectionTypeData: CashCollectionDeviceType[] = [];
    const cashSumMap = new Map<number, { sum: number; virtSum: number }>();

    await Promise.all(
      cashCollectionDevices.map((cashCollectionDevice) => {
        const device = devices.find(
          (d) => d.id === cashCollectionDevice.carWashDeviceId,
        );
        if (!cashSumMap.get(device.carWashDeviceTypeId)) {
          cashSumMap.set(device.carWashDeviceTypeId, {
            sum: cashCollectionDevice.sum,
            virtSum: cashCollectionDevice.virtualSum,
          });
          cashCollectionTypeData.push(
            new CashCollectionDeviceType({
              cashCollectionId: cashCollectionId,
              carWashDeviceTypeId: device.carWashDeviceTypeId,
              carWashDeviceTypeName: device.carWashDeviceTypeName,
              sumFact: 0,
              sumCoin: 0,
              sumPaper: 0,
              shortage: 0,
              virtualSum: 0,
            }),
          );
        } else {
          cashSumMap.set(device.carWashDeviceTypeId, {
            sum:
              cashSumMap.get(device.carWashDeviceTypeId).sum +
              cashCollectionDevice.sum,
            virtSum:
              cashSumMap.get(device.carWashDeviceTypeId).virtSum +
              cashCollectionDevice.virtualSum,
          });
        }
      }),
    );

    cashCollectionTypeData.map((cashCollectionType) => {
      cashCollectionType.shortage = cashSumMap.get(
        cashCollectionType.carWashDeviceTypeId,
      ).sum;
      cashCollectionType.virtualSum = cashSumMap.get(
        cashCollectionType.carWashDeviceTypeId,
      ).virtSum;
    });

    return await this.cashCollectionDeviceTypeRepository.createMany(
      cashCollectionTypeData,
    );
  }
}
