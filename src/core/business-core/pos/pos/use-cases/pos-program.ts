import { Injectable } from '@nestjs/common';
import { PosProgramResponseDto } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { DataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';

@Injectable()
export class ProgramPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly dataDeviceProgramUseCase: DataDeviceProgramUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    posId?: number,
  ): Promise<PosProgramResponseDto[]> {
    const response: PosProgramResponseDto[] = [];
    let poses: PosResponseDto[] = [];
    if (posId) {
      poses.push(await this.findMethodsPosUseCase.getById(posId));
    } else {
      poses = await this.findMethodsPosUseCase.getAllByAbility(ability);
    }

    await Promise.all(
      poses.map(async (pos) => {
        const devicePrograms =
          await this.findMethodsDeviceProgramUseCase.getAllByPosIdAndDateProgram(
            pos.id,
            dateStart,
            dateEnd,
          );
        const lastProg =
          await this.findMethodsDeviceProgramUseCase.getLastByPosId(pos.id);
        if (devicePrograms.length > 0) {
          const programs = await this.dataDeviceProgramUseCase.execute(
            devicePrograms,
            lastProg,
          );
          response.push({
            id: pos.id,
            name: pos.name,
            programsInfo: programs,
          });
        }
      }),
    );

    return response;
  }
}
