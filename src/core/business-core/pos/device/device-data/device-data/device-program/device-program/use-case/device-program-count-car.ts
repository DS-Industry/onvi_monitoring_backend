import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import {
  PORTAL_PROGRAM_TYPES,
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';

@Injectable()
export class CountCarDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async executeByDevice(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    const devicePrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByDeviceIdAndDateProgram(
        deviceId,
        dateStart,
        dateEnd,
      );

    let lastCheckAutoTime = null;
    let carCount = 0;

    if (devicePrograms.length > 0) {
      const firstProgram = devicePrograms[0];

      if (
        firstProgram.carWashDeviceProgramsTypeId === PROGRAM_TYPE_ID_CHECK_AUTO
      ) {
        lastCheckAutoTime =
          await this.deviceProgramRepository.findProgramForCheckCar(
            deviceId,
            firstProgram.beginDate,
            PROGRAM_TYPE_ID_CHECK_AUTO,
          );
      }
    }

    for (const deviceProgram of devicePrograms) {
      if (
        deviceProgram.carWashDeviceProgramsTypeId === PROGRAM_TYPE_ID_CHECK_AUTO
      ) {
        if (
          lastCheckAutoTime === null ||
          (deviceProgram.beginDate.getTime() - lastCheckAutoTime.getTime()) /
            (1000 * 60) >
            PROGRAM_TIME_CHECK_AUTO
        ) {
          carCount++;
        }
        lastCheckAutoTime = deviceProgram.beginDate;
      }
    }

    return carCount;
  }

  async executeByDeviceProgram(
    devicePrograms: DeviceProgram[],
  ): Promise<number> {
    const lastCheckAutoTimeMap = new Map<number, Date>();
    let totalCars = 0;

    for (const program of devicePrograms) {
      if (PORTAL_PROGRAM_TYPES.includes(program.carWashDeviceProgramsTypeId)) {
        totalCars++;
      } else if (
        program.carWashDeviceProgramsTypeId === PROGRAM_TYPE_ID_CHECK_AUTO
      ) {
        const deviceId = program.carWashDeviceId;
        const lastCheckAutoTime = lastCheckAutoTimeMap.get(deviceId);

        if (
          lastCheckAutoTime === undefined ||
          (program.beginDate.getTime() - lastCheckAutoTime.getTime()) /
            (1000 * 60) >
            PROGRAM_TIME_CHECK_AUTO
        ) {
          totalCars++;
        }

        lastCheckAutoTimeMap.set(deviceId, program.beginDate);
      }
    }

    return totalCars;
  }
}
