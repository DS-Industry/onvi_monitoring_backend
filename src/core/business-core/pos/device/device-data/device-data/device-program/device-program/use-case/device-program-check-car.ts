import { Injectable } from '@nestjs/common';
import {
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';

@Injectable()
export class CheckCarDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(
    dateProgram: Date,
    deviceId: number,
    programTypeId: number,
  ): Promise<boolean> {
    if (programTypeId != PROGRAM_TYPE_ID_CHECK_AUTO) {
      return false;
    }
    const lastProgramDate =
      await this.deviceProgramRepository.findProgramForCheckCar(
        deviceId,
        dateProgram,
        programTypeId,
      );
    if (!lastProgramDate) {
      return true;
    }
    const timeDiffInMinutes =
      (dateProgram.getTime() - lastProgramDate.getTime()) / (1000 * 60);
    return (
      Math.trunc(timeDiffInMinutes * 10000) / 10000 > PROGRAM_TIME_CHECK_AUTO
    );
  }
}
