import { Injectable } from '@nestjs/common';
import {
  PORTAL_PROGRAM_TYPES,
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';

@Injectable()
export class CountCarDeviceProgramUseCase {
  constructor() {}

  async executeByDeviceProgram(
    devicePrograms: DeviceProgramFullDataResponseDto[],
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
