import { Injectable } from '@nestjs/common';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { CreateDeviceOperationCardUseCase } from '@device/device-operation-card/use-cases/device-operation-card-create';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { CurrencyType } from '@prisma/client';

@Injectable()
export class DeviceOperationCardHandlerUseCase {
  constructor(
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
    private readonly createDeviceOperationCardUseCase: CreateDeviceOperationCardUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let deviceId: number = null;
    let errNumId: number = null;
    let operId = input.oper;
    let currency: CurrencyType = CurrencyType.CASH;
    let cardNumber = String(input.counter);

    if (operId === 9 || operId === 10) {
      if (input.localId != 0) {
        cardNumber = String(input.localId) + cardNumber;
      }
    }

    if (operId === 9) {
      currency = CurrencyType.CASHLESS;
      operId = 7;
    } else if (operId === 10) {
      currency = CurrencyType.CASHLESS;
      operId = 8;
    }

    const device = await this.getByIdCarWashDeviceUseCase.execute(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const loadDate = new Date(Date.now());
    const discountSum = Number(((input.data * input.status) / 100).toFixed(2));
    await this.createDeviceOperationCardUseCase.execute({
      carWashDeviceId: deviceId,
      operDate: input.begDate,
      loadDate: loadDate,
      sum: input.data,
      currency: currency,
      localId: input.localId,
      discount: input.status,
      discountSum: discountSum,
      cardNumber: cardNumber,
      operId: operId,
      errNumId: errNumId,
    });
  }
}
