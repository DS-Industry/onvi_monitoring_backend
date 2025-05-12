import { Injectable } from '@nestjs/common';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { CarWashDevice } from '@pos/device/device/domain/device';

@Injectable()
export class GetOneFullDataCashCollectionUseCase {
  constructor(
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
    private readonly findMethodsCashCollectionDeviceUseCase: FindMethodsCashCollectionDeviceUseCase,
  ) {}
  async execute(
    cashCollection: CashCollection,
    devices: CarWashDevice[],
  ): Promise<CashCollectionResponseDto> {
    const cashCollectionDevices =
      await this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
        cashCollection.id,
      );
    const cashCollectionDeviceResponse = cashCollectionDevices.map(
      (cashDevice) => {
        const matchedDevice = devices.find(
          (device) => device.id === cashDevice.carWashDeviceId,
        );
        return {
          id: cashDevice.id!,
          deviceId: cashDevice.carWashDeviceId,
          deviceName: matchedDevice.name,
          deviceType: matchedDevice.carWashDeviceTypeName,
          oldTookMoneyTime: cashDevice.oldTookMoneyTime,
          tookMoneyTime: cashDevice.tookMoneyTime,
          sumDevice: cashDevice.sum,
          sumCoinDevice: cashDevice.sumCoin,
          sumPaperDevice: cashDevice.sumPaper,
          virtualSumDevice: cashDevice.virtualSum,
        };
      },
    );
    const cashCollectionDeviceType =
      await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
        cashCollection.id,
      );
    const cashCollectionDeviceTypeResponse = cashCollectionDeviceType.map(
      (cashDeviceType) => {
        return {
          id: cashDeviceType.id,
          typeName: cashDeviceType.carWashDeviceTypeName,
          sumCoinDeviceType: cashDeviceType.sumCoin,
          sumPaperDeviceType: cashDeviceType.sumPaper,
          sumFactDeviceType: cashDeviceType.sumFact,
          shortageDeviceType: cashDeviceType.shortage,
          virtualSumDeviceType: cashDeviceType.virtualSum,
        };
      },
    );
    return {
      id: cashCollection.id,
      cashCollectionDate: cashCollection.cashCollectionDate,
      oldCashCollectionDate: cashCollection.oldCashCollectionDate,
      status: cashCollection.status,
      sumFact: cashCollection.sumFact,
      virtualSum: cashCollection.virtualSum,
      sumCard: cashCollection.sumCard,
      shortage: cashCollection.shortage,
      countCar: cashCollection.countCar,
      averageCheck: cashCollection.averageCheck,
      cashCollectionDeviceType: cashCollectionDeviceTypeResponse,
      cashCollectionDevice: cashCollectionDeviceResponse,
    };
  }
}
