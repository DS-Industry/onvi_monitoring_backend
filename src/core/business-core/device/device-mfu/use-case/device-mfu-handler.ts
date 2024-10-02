import { Injectable } from '@nestjs/common';
import { CreateDeviceMfuUseCase } from '@device/device-mfu/use-case/device-mfu-create';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";

@Injectable()
export class DeviceMfuHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly createDeviceMfuUseCase: CreateDeviceMfuUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let deviceId: number = null;
    let errNumId: number = null;

    const device = await this.findMethodsCarWashDeviceUseCase.getById(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const loadDate = new Date(Date.now());
    await this.createDeviceMfuUseCase.execute({
      carWashDeviceId: deviceId,
      cashIn: input.counter,
      coinOut: input.data,
      beginDate: input.begDate,
      endDate: input.endDate,
      localId: input.localId,
      loadDate: loadDate,
      errNumId: errNumId,
    });
  }
}
