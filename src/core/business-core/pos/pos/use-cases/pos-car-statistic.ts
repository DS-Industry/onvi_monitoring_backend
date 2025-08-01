import { Injectable } from '@nestjs/common';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  PORTAL_PROGRAM_TYPES,
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';

@Injectable()
export class CarStatisticPosUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    const devicePrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByPosIdAndDateProgram(
        posId,
        dateStart,
        dateEnd,
      );
    return this.countCarsInPrograms(devicePrograms);
  }
  private countCarsInPrograms(devicePrograms: DeviceProgram[]): number {
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
