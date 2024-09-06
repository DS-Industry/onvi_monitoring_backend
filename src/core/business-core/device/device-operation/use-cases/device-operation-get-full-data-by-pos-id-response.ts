import { Injectable } from '@nestjs/common';
import { GetByIdCurrencyUseCase } from '@device/currency/currency/use-case/currency-get-by-id';
import { DeviceOperationGetAllByDeviceIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-device-id-and-date';
import { DeviceOperationGetAllByDeviceIdAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-device-id-and-date.dto';
import { DeviceOperationDataResponseDto } from '@device/device-operation/use-cases/dto/device-operation-data-response.dto';
import { DeviceOperationGetLastOperByDeviceIdUseCase } from '@device/device-operation/use-cases/device-operation-get-last-oper-by-device-id';

@Injectable()
export class GetFullDataByPosIdDeviceOperationResponseUseCase {
  constructor(
    private readonly getByIdCurrencyUseCase: GetByIdCurrencyUseCase,
    private readonly deviceOperationGetAllByDeviceIdAndDateUseCase: DeviceOperationGetAllByDeviceIdAndDateUseCase,
    private readonly deviceOperationGetLastOperByDeviceIdUseCase: DeviceOperationGetLastOperByDeviceIdUseCase,
  ) {}

  async execute(
    input: DeviceOperationGetAllByDeviceIdAndDateDto,
  ): Promise<DeviceOperationDataResponseDto> {
    let cashSum = 0;
    let virtualSum = 0;
    let yandexSum = 0;

    const deviceOperations =
      await this.deviceOperationGetAllByDeviceIdAndDateUseCase.execute(input);
    const lastOper =
      await this.deviceOperationGetLastOperByDeviceIdUseCase.execute(
        input.deviceId,
      );

    await Promise.all(
      deviceOperations.map(async (deviceOperation) => {
        const cur = await this.getByIdCurrencyUseCase.execute(
          deviceOperation.currencyId,
        );
        if (cur.currencyType == 'CASH') {
          cashSum = cashSum + deviceOperation.operSum;
        } else if (cur.currencyType == 'CASHLESS') {
          virtualSum = virtualSum + deviceOperation.operSum;
        } else {
          yandexSum = yandexSum + deviceOperation.operSum;
        }
      }),
    );

    return {
      counter: deviceOperations.length,
      cashSum: cashSum,
      virtualSum: virtualSum,
      yandexSum: yandexSum,
      lastOper: lastOper ? lastOper.loadDate : undefined,
    };
  }
}
