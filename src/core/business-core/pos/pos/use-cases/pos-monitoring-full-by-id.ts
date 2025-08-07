import { Injectable } from '@nestjs/common';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CurrencyType } from '@prisma/client';
import { Pos } from '@pos/pos/domain/pos';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';

@Injectable()
export class MonitoringFullByIdPosUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    pos: Pos,
  ): Promise<PosMonitoringFullResponseDto[]> {
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(
      pos.id,
    );
    const response: PosMonitoringFullResponseDto[] = [];

    const allOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        posIds: [pos.id],
        dateStart,
        dateEnd,
      });

    const operationsByDevice = allOperations.reduce((map, operation) => {
      const deviceId = operation.carWashDeviceId;
      if (!map.has(deviceId)) {
        map.set(deviceId, []);
      }
      map.get(deviceId).push(operation);
      return map;
    }, new Map<number, DeviceOperationFullDataResponseDto[]>());

    for (const device of devices) {
      const deviceOperations = operationsByDevice.get(device.id) || [];

      const lastOper =
        await this.findMethodsDeviceOperationUseCase.getLastByDeviceIdUseCase(
          device.id,
        );

      const sums = deviceOperations.reduce(
        (acc, operation) => {
          const sum = operation.operSum;
          switch (operation.currencyType) {
            case CurrencyType.CASH:
              acc.cash += sum;
              break;
            case CurrencyType.CASHLESS:
              acc.virtual += sum;
              break;
            case CurrencyType.VIRTUAL:
              acc.yandex += sum;
              break;
          }
          return acc;
        },
        { cash: 0, virtual: 0, yandex: 0 },
      );

      response.push({
        id: device.id,
        name: device.name,
        counter: deviceOperations.length,
        cashSum: sums.cash,
        virtualSum: sums.virtual,
        yandexSum: sums.yandex,
        mobileSum: 0,
        cardSum: 0,
        lastOper: lastOper?.operDate || null,
        discountSum: 0,
        cashbackSumCard: 0,
        cashbackSumMub: 0,
      });
    }

    return response;
  }
}
