import { Injectable } from '@nestjs/common';
import { DeviceOperationGetAllByDeviceIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-device-id-and-date';
import { DeviceOperationGetAllByDeviceIdAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-device-id-and-date.dto';
import { DeviceOperationMonitoringResponseDto } from '@platform-user/device/controller/dto/device-operation-monitoring-response.dto';
import { GetByIdCurrencyUseCase } from '@device/currency/currency/use-case/currency-get-by-id';

@Injectable()
export class MonitoringDeviceUseCase {
  constructor(
    private readonly deviceOperationGetAllByDeviceIdAndDateUseCase: DeviceOperationGetAllByDeviceIdAndDateUseCase,
    private readonly getByIdCurrencyUseCase: GetByIdCurrencyUseCase,
  ) {}

  async execute(
    input: DeviceOperationGetAllByDeviceIdAndDateDto,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    const response: DeviceOperationMonitoringResponseDto[] = [];
    const deviceOperations =
      await this.deviceOperationGetAllByDeviceIdAndDateUseCase.execute(input);
    await Promise.all(
      deviceOperations.map(async (deviceOperation) => {
        const cur = await this.getByIdCurrencyUseCase.execute(
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
