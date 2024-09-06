import { Injectable } from '@nestjs/common';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { GetByIdDeviceProgramTypeUseCase } from '@device/device-program/device-program-type/use-case/device-program-type-get-by-id';
import { CreateDeviceServiceUseCase } from '@device/device-service/use-case/device-service-create';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';

@Injectable()
export class DeviceServiceHandlerUseCase {
  constructor(
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
    private readonly getByIdDeviceProgramTypeUseCase: GetByIdDeviceProgramTypeUseCase,
    private readonly createDeviceServiceUseCase: CreateDeviceServiceUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let program: number = null;
    let deviceId: number = null;
    let errNumId: number = null;

    const device = await this.getByIdCarWashDeviceUseCase.execute(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const programType = await this.getByIdDeviceProgramTypeUseCase.execute(
      input.data,
    );
    if (!programType) {
      errNumId = 6;
    } else {
      program = programType.id;
    }

    const loadDate = new Date(Date.now());
    await this.createDeviceServiceUseCase.execute({
      carWashDeviceId: deviceId,
      carWashDeviceProgramsTypeId: program,
      beginDate: input.begDate,
      endDate: input.endDate,
      loadDate: loadDate,
      localId: input.localId,
      counter: input.counter,
      errNumId: errNumId,
    });
  }
}
