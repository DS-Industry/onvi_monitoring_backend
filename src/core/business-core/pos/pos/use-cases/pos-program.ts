import { Injectable } from '@nestjs/common';
import { PosProgramResponseDto } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { DataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';

@Injectable()
export class ProgramPosUseCase {
  constructor(
    private readonly findMethodsCarWashPosUseCase: FindMethodsCarWashPosUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly dataDeviceProgramUseCase: DataDeviceProgramUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    placementId: number | '*',
    pos?: Pos,
  ): Promise<PosProgramResponseDto[]> {
    const response: PosProgramResponseDto[] = [];
    let poses: Pos[] = [];
    if (pos) {
      poses.push(pos);
    } else {
      poses = await this.findMethodsPosUseCase.getAllByAbilityPos(
        ability,
        placementId,
      );
    }

    await Promise.all(
      poses.map(async (pos) => {
        const carWashPos = await this.findMethodsCarWashPosUseCase.getById(
          pos.id,
        );
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
            posType: carWashPos.carWashPosType,
            programsInfo: programs,
          });
        }
      }),
    );

    return response;
  }
}
