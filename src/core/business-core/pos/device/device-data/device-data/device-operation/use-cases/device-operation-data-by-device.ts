import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsCurrencyUseCase } from '@pos/device/device-data/currency/currency/use-case/currency-find-methods';
import { DeviceOperationMonitoringResponseDto } from '@platform-user/core-controller/dto/response/device-operation-monitoring-response.dto';

@Injectable()
export class DataByDeviceOperationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsCurrencyUseCase: FindMethodsCurrencyUseCase,
  ) {}

  async execute(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    const response: DeviceOperationMonitoringResponseDto[] = [];
    const deviceOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
        deviceId,
        dateStart,
        dateEnd,
      );
    await Promise.all(
      deviceOperations.map(async (deviceOperation) => {
        const cur = await this.findMethodsCurrencyUseCase.getById(
          deviceOperation.currencyId,
        );
        response.push({
          id: deviceOperation.id,
          sumOper: deviceOperation.operSum,
          dateOper: deviceOperation.operDate,
          dateLoad: deviceOperation.loadDate,
          counter: deviceOperation.counter,
          localId: deviceOperation.localId,
          currencyType: cur.name,
        });
      }),
    );
    return response;
  }
}
