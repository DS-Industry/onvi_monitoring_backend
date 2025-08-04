import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';

@Injectable()
export class CarStatisticPosUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly countCarDeviceProgramUseCase: CountCarDeviceProgramUseCase,
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
    return await this.countCarDeviceProgramUseCase.executeByDeviceProgram(
      devicePrograms,
    );
  }
}
