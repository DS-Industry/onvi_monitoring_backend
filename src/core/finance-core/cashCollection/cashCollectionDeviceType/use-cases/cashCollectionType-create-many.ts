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
  ): Promise<void> {
    const deviceMap = new Map(devices.map((d) => [d.id, d]));

    const typeSums = cashCollectionDevices.reduce((acc, device) => {
      const deviceType = deviceMap.get(
        device.carWashDeviceId,
      )?.carWashDeviceTypeId;
      if (!deviceType) return acc;

      if (!acc.has(deviceType)) {
        acc.set(deviceType, {
          sum: 0,
          virtSum: 0,
          typeName:
            deviceMap.get(device.carWashDeviceId)?.carWashDeviceTypeName || '',
        });
      }

      const sums = acc.get(deviceType)!;
      sums.sum += device.sum;
      sums.virtSum += device.virtualSum;

      return acc;
    }, new Map<number, { sum: number; virtSum: number; typeName: string }>());

    const cashCollectionTypeData = Array.from(typeSums.entries()).map(
      ([typeId, { sum, virtSum, typeName }]) =>
        new CashCollectionDeviceType({
          cashCollectionId,
          carWashDeviceTypeId: typeId,
          carWashDeviceTypeName: typeName,
          sumFact: 0,
          sumCoin: 0,
          sumPaper: 0,
          shortage: sum,
          virtualSum: virtSum,
        }),
    );

    await this.cashCollectionDeviceTypeRepository.createMany(
      cashCollectionTypeData,
    );
  }
}
