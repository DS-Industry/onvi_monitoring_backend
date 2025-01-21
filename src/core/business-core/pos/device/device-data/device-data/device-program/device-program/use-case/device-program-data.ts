import { Injectable } from '@nestjs/common';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { PosProgramInfo } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';

@Injectable()
export class DataDeviceProgramUseCase {
  constructor(
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
  ) {}

  async execute(
    input: DeviceProgram[],
    lastProg: DeviceProgram,
  ): Promise<PosProgramInfo[]> {
    const groupedPrograms: { [key: string]: PosProgramInfo } = {};
    const programTypeCache = new Map<number, string>();

    await Promise.all(
      input.map(async (deviceProgram) => {
        if (!programTypeCache.has(deviceProgram.carWashDeviceProgramsTypeId)) {
          const programType =
            await this.findMethodsDeviceProgramTypeUseCase.getById(
              deviceProgram.carWashDeviceProgramsTypeId,
            );
          programTypeCache.set(
            deviceProgram.carWashDeviceProgramsTypeId,
            programType.name,
          );
        }
        const programName = programTypeCache.get(
          deviceProgram.carWashDeviceProgramsTypeId,
        );

        if (groupedPrograms[programName]) {
          groupedPrograms[programName].counter += 1;
          groupedPrograms[programName].totalTime += Math.trunc(
            (deviceProgram.endDate.getTime() -
              deviceProgram.beginDate.getTime()) /
              1000,
          );
          if (groupedPrograms[programName].lastOper < deviceProgram.beginDate) {
            groupedPrograms[programName].lastOper = deviceProgram.beginDate;
          }
        } else {
          groupedPrograms[programName] = {
            programName: programName,
            counter: 1,
            totalTime: Math.trunc(
              (deviceProgram.endDate.getTime() -
                deviceProgram.beginDate.getTime()) /
                1000,
            ),
            averageTime: '',
            lastOper: lastProg ? lastProg.beginDate : undefined,
          };
        }
      }),
    );
    const response: PosProgramInfo[] = Object.values(groupedPrograms);

    for (const program of response) {
      if (program.counter > 0) {
        const averageTimeSeconds = Math.trunc(
          program.totalTime / program.counter,
        );
        program.averageTime = this.formatSecondsToTime(averageTimeSeconds);
        program.totalTime = Math.round(program.totalTime / 60);
      }
    }
    return response;
  }

  private formatSecondsToTime(seconds: number): string {
    const days = Math.trunc(seconds / 86400); // 86400 секунд в сутках
    const hours = Math.trunc((seconds % 86400) / 3600); // 3600 секунд в часе
    const minutes = Math.trunc((seconds % 3600) / 60); // 60 секунд в минуте
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
