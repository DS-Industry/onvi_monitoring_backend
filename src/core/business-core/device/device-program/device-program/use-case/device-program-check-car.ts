import { Injectable } from '@nestjs/common';
import { DeviceProgramCheckCarDto } from '@device/device-program/device-program/use-case/dto/device-program-check-car.dto';
import {
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';

@Injectable()
export class CheckCarDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(input: DeviceProgramCheckCarDto): Promise<boolean> {
    if (input.programTypeId != PROGRAM_TYPE_ID_CHECK_AUTO) {
      return false;
    }
    const lastProgramDate =
      await this.deviceProgramRepository.findProgramForCheckCar(
        input.deviceId,
        input.dateProgram,
        input.programTypeId,
      );
    if (!lastProgramDate) {
      return true;
    }
    const timeDiffInMinutes =
      (input.dateProgram.getTime() - lastProgramDate.getTime()) / (1000 * 60);
    return (
      Math.trunc(timeDiffInMinutes * 10000) / 10000 > PROGRAM_TIME_CHECK_AUTO
    );
  }
}
