import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@device/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { GetByIdDeviceProgramTypeUseCase } from '@device/device-program/device-program-type/use-case/device-program-type-get-by-id';
import { CreateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-create';

@Injectable()
export class DeviceProgramHandlerUseCase {
  constructor(
    private readonly getByIdCarWashDeviceUseCase: GetByIdCarWashDeviceUseCase,
    private readonly getByIdDeviceProgramTypeUseCase: GetByIdDeviceProgramTypeUseCase,
    private readonly createDeviceProgramUseCase: CreateDeviceProgramUseCase,
  ) {}

  async execute(input: DeviceDataRawHandlerResponse): Promise<void> {
    let program: number;
    let paid: number;
    let deviceId: number = null;
    let errNumId: number = null;

    if (input.data < 100) {
      program = input.data % 10;
      paid = Math.trunc(input.data / 10);
    } else {
      program = input.data % 100;
      paid = Math.trunc(input.data / 100);
      if (paid === 9) {
        paid = 0;
      }
    }

    const device = await this.getByIdCarWashDeviceUseCase.execute(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const programType =
      await this.getByIdDeviceProgramTypeUseCase.execute(program);
    if (!programType) {
      errNumId = 6;
      program = null;
    }

    const loadDate = new Date(Date.now());
    await this.createDeviceProgramUseCase.execute({
      carWashDeviceId: deviceId,
      carWashDeviceProgramsTypeId: program,
      isPaid: paid,
      beginDate: input.begDate,
      localId: input.localId,
      endDate: input.endDate,
      confirm: 1,
      loadDate: loadDate,
      errNumId: errNumId,
    });
  }
}
