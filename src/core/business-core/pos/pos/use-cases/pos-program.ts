import { Injectable } from '@nestjs/common';
import {
  PosProgramDto,
  PosProgramResponseDto,
} from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashPosType } from '@prisma/client';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
import { DeviceProgramLastDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-last-data-response.dto';

@Injectable()
export class ProgramPosUseCase {
  constructor(
    private readonly findMethodsCarWashPosUseCase: FindMethodsCarWashPosUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(data: {
    dateStart: Date;
    dateEnd: Date;
    ability: any;
    placementId?: number;
    organizationId?: number;
    pos?: Pos;
    skip?: number;
    take?: number;
  }): Promise<PosProgramResponseDto> {
    const { posData, totalCount } = await this.getPosData(data);
    const posIds = posData.map((pos) => pos.id);

    const [programs, lastPrograms] = await Promise.all([
      this.findMethodsDeviceProgramUseCase.getDataByMonitoring(
        posIds,
        data.dateStart,
        data.dateEnd,
      ),
      this.findMethodsDeviceProgramUseCase.getLastByPosIds(posIds),
    ]);

    const programsByPos = this.groupProgramsByPosId(programs);
    const lastProgramsByPos = this.groupLastProgramsByPosAndName(lastPrograms);

    const response: PosProgramDto[] = posData.map((pos) => {
      const posPrograms = programsByPos.get(pos.id) || [];
      const posProgramsInfo = posPrograms.map((program) => {
        const lastOper = lastProgramsByPos
          .get(pos.id)
          ?.find((p) => p.programName === program.programName)?.operDate;

        return {
          programName: program.programName,
          counter: program.counter,
          totalTime: Math.trunc(program.totalTime),
          averageTime: this.formatSecondsToTime(program.averageTime * 60),
          lastOper: lastOper,
        };
      });

      return {
        id: pos.id,
        name: pos.name,
        posType: pos.carWashPosType,
        programsInfo: posProgramsInfo,
      };
    });

    return { prog: response, totalCount };
  }

  private async getPosData(data: {
    pos?: Pos;
    ability: any;
    placementId?: number;
    organizationId?: number;
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
      await this.findMethodsPosUseCase.countAllByAbilityAndPlacement({
        ability: data.ability,
        placementId: data.placementId,
        organizationId: data.organizationId,
      });

    const poses = await this.findMethodsPosUseCase.getAllByFilter({
      ability: data.ability,
      placementId: data.placementId,
      organizationId: data.organizationId,
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

  private groupProgramsByPosId(
    programs: DeviceProgramMonitoringResponseDto[],
  ): Map<number, DeviceProgramMonitoringResponseDto[]> {
    return programs.reduce((map, program) => {
      const posId = program.ownerId;
      if (!map.has(posId)) {
        map.set(posId, []);
      }
      map.get(posId)!.push(program);
      return map;
    }, new Map<number, DeviceProgramMonitoringResponseDto[]>());
  }

  private groupLastProgramsByPosAndName(
    lastPrograms: DeviceProgramLastDataResponseDto[],
  ): Map<number, DeviceProgramLastDataResponseDto[]> {
    return lastPrograms.reduce((map, program) => {
      const posId = program.ownerId;
      if (!map.has(posId)) {
        map.set(posId, []);
      }
      map.get(posId)!.push(program);
      return map;
    }, new Map<number, DeviceProgramLastDataResponseDto[]>());
  }

  private formatSecondsToTime(seconds: number): string {
    const days = Math.trunc(seconds / 86400);
    const hours = Math.trunc((seconds % 86400) / 3600);
    const minutes = Math.trunc((seconds % 3600) / 60);
    const remainingSeconds = Math.trunc(seconds % 60);

    let result = '';

    if (days === 1) {
      result += `${days} день `;
    } else if (days > 1) {
      result += `${days} дней `;
    }

    if (hours === 1) {
      result += `${hours} час `;
    } else if (hours > 1) {
      result += `${hours} часа `;
    }

    if (minutes > 0) {
      result += `${minutes} мин. `;
    }

    if (remainingSeconds > 0) {
      result += `${remainingSeconds} сек.`;
    }

    return result.trim();
  }
}
