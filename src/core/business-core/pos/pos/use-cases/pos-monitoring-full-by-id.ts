import { Injectable } from '@nestjs/common';
import { PosMonitoringFullResponseDto } from '@platform-user/core-controller/dto/response/pos-monitoring-full-response.dto';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';

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
    const deviceIds = devices.map((device) => device.id);
    const response: PosMonitoringFullResponseDto[] = [];

    const [operations, lastOpers] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getDataByMonitoringDetail(
        deviceIds,
        dateStart,
        dateEnd,
      ),
      this.findMethodsDeviceOperationUseCase.getDataLastOperByDeviceIds(
        deviceIds,
      ),
    ]);

    const operationsMap = new Map<
      number,
      DeviceOperationMonitoringResponseDto
    >();
    operations.forEach((op) => operationsMap.set(op.ownerId, op));

    const lastDatesMap = lastOpers.reduce((map, item) => {
      map.set(item.ownerId, item.operDate);
      return map;
    }, new Map<number, Date>());

    for (const device of devices) {
      const deviceOperations = operationsMap.get(device.id);

      response.push({
        id: device.id,
        name: device.name,
        counter: deviceOperations?.counter,
        cashSum: deviceOperations?.cashSum,
        virtualSum: deviceOperations?.virtualSum,
        yandexSum: deviceOperations?.yandexSum,
        mobileSum: 0,
        cardSum: 0,
        lastOper: lastDatesMap.get(device.id) || undefined,
        discountSum: 0,
        cashbackSumCard: 0,
        cashbackSumMub: 0,
      });
    }

    return response;
  }
}
