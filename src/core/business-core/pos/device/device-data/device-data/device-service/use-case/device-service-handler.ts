import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { IDeviceServiceRepository } from '@pos/device/device-data/device-data/device-service/interface/device-service';
import { DeviceService } from '@pos/device/device-data/device-data/device-service/domain/device-service';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';

@Injectable()
export class DeviceServiceHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly deviceServiceRepository: IDeviceServiceRepository,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let program: number = null;
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

    const programType = await this.findMethodsDeviceProgramTypeUseCase.getById(
      input.data,
    );
    if (!programType) {
      errNumId = 6;
    } else {
      program = programType.id;
    }

    const loadDate = new Date(Date.now());
    const deviceService = new DeviceService({
      carWashDeviceId: deviceId,
      carWashDeviceProgramsTypeId: program,
      beginDate: input.begDate,
      endDate: input.endDate,
      loadDate: loadDate,
      localId: input.localId,
      counter: input.counter,
      errNumId: errNumId,
    });
    await this.deviceServiceRepository.create(deviceService);
  }
}
