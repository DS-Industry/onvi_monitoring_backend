import { Injectable } from '@nestjs/common';
import { DeviceOperationGetAllByPosIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-pos-id-and-date';
import { DeviceOperationGetAllByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-pos-id-and-date.dto';
import { DeviceOperationDataResponseDto } from '@device/device-operation/use-cases/dto/device-operation-data-response.dto';
import { GetByIdCurrencyUseCase } from '@device/currency/currency/use-case/currency-get-by-id';
import { DeviceOperationGetLastOperByPosIdUseCase } from '@device/device-operation/use-cases/device-operation-get-last-oper-by-pos-id';

@Injectable()
export class GetDataByPosIdResponseDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationGetAllByPosIdAndDateUseCase: DeviceOperationGetAllByPosIdAndDateUseCase,
    private readonly getByIdCurrencyUseCase: GetByIdCurrencyUseCase,
    private readonly deviceOperationGetLastOperByPosIdUseCase: DeviceOperationGetLastOperByPosIdUseCase,
  ) {}

  async execute(
    input: DeviceOperationGetAllByCutTypeAndDateDto,
  ): Promise<DeviceOperationDataResponseDto> {
    let cashSum = 0;
    let virtualSum = 0;
    let yandexSum = 0;

    const deviceOperations =
      await this.deviceOperationGetAllByPosIdAndDateUseCase.execute(input);
    const lastOper =
      await this.deviceOperationGetLastOperByPosIdUseCase.execute(
        input.carWashPosId,
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
