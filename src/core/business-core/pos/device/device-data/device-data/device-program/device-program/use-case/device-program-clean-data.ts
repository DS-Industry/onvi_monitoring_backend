import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import {
  CleanDataResponseDto,
  ProgramDataDto,
} from '@platform-user/core-controller/dto/response/clean-data-response.dto';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  DeviceProgramFullDataResponseDto
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto";

@Injectable()
export class CleanDataDeviceProgramUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<CleanDataResponseDto[]> {
    const devicePrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByFilter({
        posId: posId,
        isPaid: 0,
        dateStart: dateStart,
        dateEnd: dateEnd,
      });

    const groupedByDevice = devicePrograms.reduce(
      (acc, program) => {
        if (!acc[program.carWashDeviceId]) {
          acc[program.carWashDeviceId] = [];
        }
        acc[program.carWashDeviceId].push(program);
        return acc;
      },
      {} as Record<number, DeviceProgramFullDataResponseDto[]>,
    );

    return Object.entries(groupedByDevice).map(([deviceId, programs]) => {
      const groupedByProgramName = programs.reduce(
        (acc, program) => {
          if (!program.programName) return acc;
          if (!acc[program.programName]) {
            acc[program.programName] = {
              countProgram: 0,
              totalSeconds: 0,
            };
          }

          acc[program.programName].countProgram += 1;
          acc[program.programName].totalSeconds += Math.trunc(
            (new Date(program.endDate).getTime() -
              new Date(program.beginDate).getTime()) /
              1000,
          );

          return acc;
        },
        {} as Record<string, { countProgram: number; totalSeconds: number }>,
      );

      const programData: ProgramDataDto[] = Object.entries(
        groupedByProgramName,
      ).map(([programName, data]) => {
        return {
          programName,
          countProgram: data.countProgram,
          time: this.formatSecondsToTime(data.totalSeconds),
        };
      });

      return {
        deviceId: +deviceId,
        programData,
      };
    });
  }

  private formatSecondsToTime(totalSeconds: number): string {
    const days = Math.trunc(totalSeconds / 86400); // 86400 секунд в сутках
    const hours = Math.trunc((totalSeconds % 86400) / 3600); // 3600 секунд в часе
    const minutes = Math.trunc((totalSeconds % 3600) / 60); // 60 секунд в минуте
    const remainingSeconds = Math.trunc(totalSeconds % 60);

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
