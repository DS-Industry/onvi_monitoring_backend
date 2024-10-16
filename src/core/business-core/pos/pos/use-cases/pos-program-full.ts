import { Injectable } from '@nestjs/common';
import { DataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data';
import { PosProgramResponseDto } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from "@pos/pos/domain/pos";

@Injectable()
export class PosProgramFullUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly dataDeviceProgramUseCase: DataDeviceProgramUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    pos: Pos,
  ): Promise<PosProgramResponseDto[]> {
    const response: PosProgramResponseDto[] = [];
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(
      pos.id,
    );

    await Promise.all(
      devices.map(async (device) => {
        const devicePrograms =
          await this.findMethodsDeviceProgramUseCase.getAllByDeviceIdAndDateProgram(
            device.id,
            dateStart,
            dateEnd,
          );
        const lastProg =
          await this.findMethodsDeviceProgramUseCase.getLastByDeviceId(
            device.id,
          );
        if (devicePrograms.length > 0) {
          const programs = await this.dataDeviceProgramUseCase.execute(
            devicePrograms,
            lastProg,
          );
          response.push({
            id: device.id,
            name: device.name,
            programsInfo: programs,
          });
        }
      }),
    );

    return response;
  }
}
