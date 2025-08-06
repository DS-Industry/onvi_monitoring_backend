import { Injectable } from '@nestjs/common';
import {
  PosProgramDto,
  PosProgramResponseDto,
} from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { DataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashPosType } from '@prisma/client';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';

@Injectable()
export class ProgramPosUseCase {
  constructor(
    private readonly findMethodsCarWashPosUseCase: FindMethodsCarWashPosUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly dataDeviceProgramUseCase: DataDeviceProgramUseCase,
  ) {}

  async execute(data: {
    dateStart: Date;
    dateEnd: Date;
    ability: any;
    placementId: number;
    pos?: Pos;
    skip?: number;
    take?: number;
  }): Promise<PosProgramResponseDto> {
    const { posData, totalCount } = await this.getPosData(data);

    const allPrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByFilter({
        posId: data.pos?.id,
        ability: data.pos ? undefined : data.ability,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
      });

    const programsByPos = this.groupProgramsByPos(allPrograms);

    const response: PosProgramDto[] = [];
    for (const pos of posData) {
      const posPrograms = programsByPos.get(pos.id) || [];

      const lastProg =
        await this.findMethodsDeviceProgramUseCase.getLastByPosId(pos.id);

      const programsInfo =
        posPrograms.length > 0
          ? await this.dataDeviceProgramUseCase.execute(posPrograms, lastProg)
          : [];

      response.push({
        id: pos.id,
        name: pos.name,
        posType: pos.carWashPosType,
        programsInfo,
      });
    }

    return { prog: response, totalCount };
  }

  private async getPosData(data: {
    pos?: Pos;
    ability: any;
    placementId: number;
    skip?: number;
    take?: number;
  }): Promise<{
    posData: { id: number; name: string; carWashPosType: CarWashPosType }[];
    totalCount: number;
  }> {
    if (data.pos) {
      const carWashPos = await this.findMethodsCarWashPosUseCase.getById(
        data.pos.id,
      );
      return {
        posData: [
          {
            id: data.pos.id,
            name: data.pos.name,
            carWashPosType: carWashPos.carWashPosType,
          },
        ],
        totalCount: 1,
      };
    }

    const totalCount =
      await this.findMethodsPosUseCase.countAllByAbilityAndPlacement(
        data.ability,
        data.placementId,
      );

    const poses = await this.findMethodsPosUseCase.getAllByFilter({
      ability: data.ability,
      placementId: data.placementId,
      skip: data.skip,
      take: data.take,
    });

    return {
      posData: poses.map((pos) => ({
        id: pos.id,
        name: pos.name,
        carWashPosType: pos.posType.carWashPosType,
      })),
      totalCount,
    };
  }

  private groupProgramsByPos(
    programs: DeviceProgramFullDataResponseDto[],
  ): Map<number, DeviceProgramFullDataResponseDto[]> {
    return programs.reduce((map, program) => {
      const posId = program.posId;
      if (!map.has(posId)) {
        map.set(posId, []);
      }
      map.get(posId)!.push(program);
      return map;
    }, new Map<number, DeviceProgramFullDataResponseDto[]>());
  }
}
