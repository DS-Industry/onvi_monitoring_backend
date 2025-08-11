import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { CleanDataResponseDto } from '@platform-user/core-controller/dto/response/clean-data-response.dto';
import { DeviceProgramCleanDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-clean-data-response.dto';

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
    const programCleans =
      await this.findMethodsDeviceProgramUseCase.getDataByClean(
        [posId],
        dateStart,
        dateEnd,
      );

    const groupedByDevice = programCleans.reduce(
      (acc, item) => {
        if (!acc[item.deviceId]) {
          acc[item.deviceId] = [];
        }
        acc[item.deviceId].push(item);
        return acc;
      },
      {} as Record<number, DeviceProgramCleanDataResponseDto[]>,
    );

    return Object.entries(groupedByDevice).map(([deviceId, programs]) => ({
      deviceId: Number(deviceId),
      programData: programs.map((program) => ({
        programName: program.programName,
        countProgram: program.counter,
        time: this.formatSecondsToTime(program.totalTime),
      })),
    }));
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
