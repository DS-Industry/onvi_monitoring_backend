import { Injectable } from '@nestjs/common';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';
import { FindMethodsCashCollectionDeviceUseCase } from '@finance/cashCollection/cashCollectionDevice/use-cases/cashCollectionDevice-find-methods';
import { CashCollection } from '@finance/cashCollection/cashCollection/domain/cashCollection';
import { CarWashDevice } from '@pos/device/device/domain/device';
import { CashCollectionDevice } from "@finance/cashCollection/cashCollectionDevice/domain/cashCollectionDevice";
import {
  CashCollectionDeviceType
} from "@finance/cashCollection/cashCollectionDeviceType/domain/cashCollectionDeviceType";

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
    const [cashCollectionDevices, cashCollectionDeviceType] = await Promise.all(
      [
        this.findMethodsCashCollectionDeviceUseCase.getAllByCashCollection(
          cashCollection.id,
        ),
        this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
          cashCollection.id,
        ),
      ],
    );

    const deviceMap = new Map(devices.map((device) => [device.id, device]));

    const cashCollectionDeviceResponse = this.mapDevicesToResponse(
      cashCollectionDevices,
      deviceMap,
    );
    const cashCollectionDeviceTypeResponse = this.mapDeviceTypesToResponse(
      cashCollectionDeviceType,
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

  private mapDevicesToResponse(
    devices: CashCollectionDevice[],
    deviceMap: Map<number, CarWashDevice>,
  ) {
    return devices.map((cashDevice) => {
      const matchedDevice = deviceMap.get(cashDevice.carWashDeviceId);
      return {
        id: cashDevice.id!,
        deviceId: cashDevice.carWashDeviceId,
        deviceName: matchedDevice?.name ?? 'Unknown',
        deviceType: matchedDevice?.carWashDeviceTypeName ?? 'Unknown',
        oldTookMoneyTime: cashDevice.oldTookMoneyTime,
        tookMoneyTime: cashDevice.tookMoneyTime,
        sumDevice: cashDevice.sum,
        sumCoinDevice: cashDevice.sumCoin,
        sumPaperDevice: cashDevice.sumPaper,
        virtualSumDevice: cashDevice.virtualSum,
      };
    });
  }

  private mapDeviceTypesToResponse(deviceTypes: CashCollectionDeviceType[]) {
    return deviceTypes.map((cashDeviceType) => ({
      id: cashDeviceType.id,
      typeName: cashDeviceType.carWashDeviceTypeName,
      sumCoinDeviceType: cashDeviceType.sumCoin,
      sumPaperDeviceType: cashDeviceType.sumPaper,
      sumFactDeviceType: cashDeviceType.sumFact,
      shortageDeviceType: cashDeviceType.shortage,
      virtualSumDeviceType: cashDeviceType.virtualSum,
    }));
  }
}
