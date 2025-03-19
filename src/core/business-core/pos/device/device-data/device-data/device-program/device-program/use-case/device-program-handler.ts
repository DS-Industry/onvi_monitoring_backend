import { Injectable } from '@nestjs/common';
import { DeviceDataRawHandlerResponse } from '@pos/device/device-data/device-data-raw/use-cases/dto/device-data-raw-handler-response';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { FindMethodsDeviceProgramChangeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-change/use-case/device-program-change-find-methods';

@Injectable()
export class DeviceProgramHandlerUseCase {
  constructor(
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly findMethodsDeviceProgramChangeUseCase: FindMethodsDeviceProgramChangeUseCase,
    private readonly deviceProgramRepository: IDeviceProgramRepository,
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
    const device = await this.findMethodsCarWashDeviceUseCase.getById(
      input.deviceId,
    );
    if (!device) {
      errNumId = 7;
    } else {
      deviceId = device.id;
    }

    const programType =
      await this.findMethodsDeviceProgramTypeUseCase.getById(program);
    if (!programType) {
      errNumId = 6;
      program = null;
    } else {
      const changeProgram =
        await this.findMethodsDeviceProgramChangeUseCase.getOneByDeviceIdAndFromId(
          deviceId,
          program,
        );
      if (changeProgram) {
        program = changeProgram.carWashDeviceProgramsTypeToId;
      }
    }

    const loadDate = new Date(Date.now());
    const deviceProgramData = new DeviceProgram({
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
    await this.deviceProgramRepository.create(deviceProgramData);
  }
}
