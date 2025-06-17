import { Injectable } from '@nestjs/common';
import { DataDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-data';
import {
  PosProgramDto,
  PosProgramInfo,
  PosProgramResponseDto
} from "@platform-user/core-controller/dto/response/pos-program-response.dto";
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashPosType } from '@prisma/client';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { DeviceOperationProps } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import {
  FindMethodsDeviceOperationCardUseCase
} from "@pos/device/device-data/device-data/device-operation-card/use-cases/device-operation-card-find-methods";

@Injectable()
export class PosProgramFullUseCase {
  constructor(
    private readonly findMethodsCarWashPosUseCase: FindMethodsCarWashPosUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly dataDeviceProgramUseCase: DataDeviceProgramUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    pos: Pos,
  ): Promise<PosProgramDto[]> {
    const response: PosProgramDto[] = [];
    const carWashPos = await this.findMethodsCarWashPosUseCase.getById(pos.id);
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(
      pos.id,
    );

    await Promise.all(
      devices.map(async (device) => {
        let programs: PosProgramInfo[];
        const devicePrograms =
          await this.findMethodsDeviceProgramUseCase.getAllByDeviceIdAndDateProgram(
            device.id,
            dateStart,
            dateEnd,
          );
        if (carWashPos.carWashPosType == CarWashPosType.SelfService) {
          const lastProg =
            await this.findMethodsDeviceProgramUseCase.getLastByDeviceId(
              device.id,
            );
          if (devicePrograms.length > 0) {
            programs = await this.dataDeviceProgramUseCase.execute(
              devicePrograms,
              lastProg,
            );
          }
        } else if (carWashPos.carWashPosType == CarWashPosType.Portal) {
          const deviceOperations =
            await this.findMethodsDeviceOperationUseCase.getAllByDeviceIdAndDateUseCase(
              device.id,
              dateStart,
              dateEnd,
            );
          programs = await this.linkProgramsWithOperations(
            devicePrograms,
            deviceOperations,
          );
        }
        response.push({
          id: device.id,
          name: device.name,
          posType: carWashPos.carWashPosType,
          programsInfo: programs,
        });
      }),
    );

    return response;
  }

  private async linkProgramsWithOperations(
    devicePrograms: DeviceProgram[],
    deviceOperations: DeviceOperationProps[],
  ): Promise<PosProgramInfo[]> {
    const groupedPrograms: { [key: string]: PosProgramInfo } = {};

    for (let i = 0; i < devicePrograms.length; i++) {
      const program = devicePrograms[i];
      const programName = program.programName;

      const currentProgramStart = program.beginDate;
      const previousProgramEnd = new Date(
        currentProgramStart.getTime() - 5 * 60 * 1000,
      );

      const operationsForProgram = deviceOperations.filter((operation) => {
        if (previousProgramEnd) {
          return (
            operation.operDate > previousProgramEnd &&
            operation.operDate <= currentProgramStart
          );
        } else {
          return operation.operDate <= currentProgramStart;
        }
      });

      let totalProfit = 0;
      operationsForProgram.forEach(
        (operation) => (totalProfit += operation.operSum),
      );

      if (groupedPrograms[programName]) {
        groupedPrograms[programName].counter += 1;
        groupedPrograms[programName].totalTime += Math.trunc(
          (program.endDate.getTime() - program.beginDate.getTime()) / 1000,
        );
        groupedPrograms[programName].totalProfit += totalProfit;
      } else {
        groupedPrograms[programName] = {
          programName: programName,
          counter: 1,
          totalTime: Math.trunc(
            (program.endDate.getTime() - program.beginDate.getTime()) / 1000,
          ),
          averageTime: '',
          totalProfit: totalProfit,
          averageProfit: 0,
        };
      }
    }

    const response: PosProgramInfo[] = Object.values(groupedPrograms);

    for (const program of response) {
      if (program.counter > 0) {
        const averageTimeSeconds = Math.trunc(
          program.totalTime / program.counter,
        );
        program.averageTime = this.formatSecondsToTime(averageTimeSeconds);
        program.totalTime = Math.round(program.totalTime / 60);
        program.averageProfit = program.totalProfit / program.counter;
      }
    }

    return response;
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
