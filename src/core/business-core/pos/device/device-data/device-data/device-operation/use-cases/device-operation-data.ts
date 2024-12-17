import { Injectable } from '@nestjs/common';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { DeviceOperationDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-data-response.dto';
import { FindMethodsCurrencyUseCase } from '@pos/device/device-data/currency/currency/use-case/currency-find-methods';

@Injectable()
export class DataDeviceOperationUseCase {
  constructor(
    private readonly findMethodsCurrencyUseCase: FindMethodsCurrencyUseCase,
  ) {}

  async execute(
    input: DeviceOperation[],
    lastOper: DeviceOperation,
  ): Promise<DeviceOperationDataResponseDto> {
    let cashSum = 0;
    let virtualSum = 0;
    let yandexSum = 0;

    await Promise.all(
      input.map(async (deviceOperation) => {
        const cur = await this.findMethodsCurrencyUseCase.getById(
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
      counter: input.length,
      cashSum: cashSum,
      virtualSum: virtualSum,
      yandexSum: yandexSum,
      lastOper: lastOper ? lastOper.operDate : undefined,
    };
  }
}
