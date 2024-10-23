import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { ICurrencyCarWashPosRepository } from '@pos/device/device-data/currency/currency-car-wash-pos/interface/currency-car-wash-pos';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';

@Injectable()
export class DeviceOperationHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceOperationRepository: IDeviceOperationRepository,
    private readonly currencyCarWashPosRepository: ICurrencyCarWashPosRepository,
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
          await this.currencyCarWashPosRepository.findOneByCarWashPosIdAndCurrencyId(
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
      const deviceOperationData = new DeviceOperation({
        carWashDeviceId: deviceId,
        operDate: input.begDate,
        loadDate: loadDate,
        counter: BigInt(counter),
        operSum: sum,
        confirm: 1,
        isAgregate: 0,
        localId: input.localId,
        currencyId: input.oper,
        isBoxOffice: 0,
        errNumId: errNumId,
      });
      await this.deviceOperationRepository.create(deviceOperationData);
    } else {
      throw new Error('Неизвестный тип операции: ' + input.oper);
    }
  }
}
