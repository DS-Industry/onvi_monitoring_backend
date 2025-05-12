import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { SuspiciouslyDataResponseDto } from '@platform-user/core-controller/dto/response/suspiciously-data-response.dto';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';

@Injectable()
export class SuspiciouslyDataDeviceProgramUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<SuspiciouslyDataResponseDto[]> {
    const devicePrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByPosIdAndDateProgram(
        posId,
        dateStart,
        dateEnd,
      );
    const groupedByDevice = devicePrograms
      .sort(
        (a, b) =>
          new Date(a.beginDate).getTime() - new Date(b.beginDate).getTime(),
      )
      .reduce(
        (acc, program) => {
          if (!acc[program.carWashDeviceId]) {
            acc[program.carWashDeviceId] = [];
          }
          acc[program.carWashDeviceId].push(program);
          return acc;
        },
        {} as Record<number, DeviceProgram[]>,
      );

    const suspiciousOperations: SuspiciouslyDataResponseDto[] = [];

    Object.entries(groupedByDevice).forEach(([deviceId, programs]) => {
      for (let i = 1; i < programs.length; i++) {
        const currentProgram = programs[i];
        const prevProgram = programs[i - 1];

        if (
          currentProgram.programName === 'Ополаскивание' &&
          currentProgram.isPaid === 0 && // Не оплачена
          prevProgram.isPaid === 1 && // Предыдущая оплачена
          ![
            'Ополаскивание',
            'Воск + защита',
            'Ополаскивание без разводов',
          ].includes(prevProgram.programName) &&
          this.getTimeDifferenceInMinutes(
            prevProgram.endDate,
            currentProgram.beginDate,
          ) <= 15
        ) {
          suspiciousOperations.push({
            deviceId: +deviceId,
            programName: currentProgram.programName,
            programDate: currentProgram.beginDate,
            programTime: this.formatSecondsToTime(
              this.getTimeDifferenceInSeconds(
                currentProgram.beginDate,
                currentProgram.endDate,
              ),
            ),
            lastProgramName: prevProgram.programName,
            lastProgramDate: prevProgram.endDate,
            lastProgramTime: this.formatSecondsToTime(
              this.getTimeDifferenceInSeconds(
                prevProgram.beginDate,
                prevProgram.endDate,
              ),
            ),
          });
        }
      }
    });

    return suspiciousOperations;
  }

  private getTimeDifferenceInMinutes(date1: Date, date2: Date): number {
    return (
      Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) /
      (1000 * 60)
    );
  }

  private getTimeDifferenceInSeconds(date1: Date, date2: Date): number {
    return (
      Math.abs(new Date(date2).getTime() - new Date(date1).getTime()) / 1000
    );
  }

  private formatSecondsToTime(totalSeconds: number): string {
    const days = Math.trunc(totalSeconds / 86400);
    const hours = Math.trunc((totalSeconds % 86400) / 3600);
    const minutes = Math.trunc((totalSeconds % 3600) / 60);
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
