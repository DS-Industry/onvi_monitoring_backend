import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase } from '@device/currency/currency-car-wash-pos/use-case/currency-car-wash-pos-get-by-car-wash-pos-id-and-currency-id';
import { CreateDeviceOperationUseCase } from '@device/device-operation/use-cases/device-operation-create';
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";

@Injectable()
export class DeviceOperationHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly getByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase: GetByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase,
    private readonly createDeviceOperationUseCase: CreateDeviceOperationUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    if (
      input.oper === 1 ||
      input.oper === 2 ||
      (input.oper >= 21 && input.oper <= 40)
    ) {
      let errNumId: number = null;
      let deviceId: number = null;
      let coef = 1;

      const device = await this.findMethodsCarWashDeviceUseCase.getById(
        input.deviceId,
      );
      if (!device) {
        errNumId = 7;
      } else {
        deviceId = device.id;
        const currencyCarWashPos =
          await this.getByCarWashPosIdAndCurrencyIdCurrencyCarWashPosUseCase.execute(
            input.oper,
            device.carWashPosId,
          );
        if (currencyCarWashPos) {
          coef = currencyCarWashPos.coef;
        }
      }

      const sum = input.data * coef;
      const counter = input.counter * coef;
      const loadDate = new Date(Date.now());
      await this.createDeviceOperationUseCase.execute({
        carWashDeviceId: deviceId,
        operDate: input.begDate,
        loadDate: loadDate,
        counter: counter,
        operSum: sum,
        confirm: 1,
        isAgregate: 0,
        localId: input.localId,
        currencyId: input.oper,
        isBoxOffice: 0,
        errNumId: errNumId,
      });
    } else {
      throw new Error('Неизвестный тип операции: ' + input.oper);
    }
  }
}
