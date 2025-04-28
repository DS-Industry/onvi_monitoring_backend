import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";
import { IDeviceMfuRepository } from "@pos/device/device-data/device-data/device-mfu/interface/device-mfu";
import { DeviceMfy } from "@pos/device/device-data/device-data/device-mfu/domain/device-mfu";

@Injectable()
export class DeviceMfuHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly deviceMfuRepository: IDeviceMfuRepository,
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
    const deviceMfu = new DeviceMfy({
      carWashDeviceId: deviceId,
      cashIn: input.counter,
      coinOut: input.data,
      beginDate: input.begDate,
      endDate: input.endDate,
      localId: input.localId,
      loadDate: loadDate,
      errNumId: errNumId,
    });
    await this.deviceMfuRepository.create(deviceMfu);
  }
}
