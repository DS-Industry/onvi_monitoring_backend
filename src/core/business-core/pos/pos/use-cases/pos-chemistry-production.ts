import { Injectable } from '@nestjs/common';
import { PosChemistryProductionDto } from '@pos/pos/use-cases/dto/pos-chemistry-production.dto';
import {
  PosChemistryProductionResponseDto,
  TechRateInfoDto,
} from '@pos/pos/use-cases/dto/pos-chemistry-production-response.dto';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';

@Injectable()
export class PosChemistryProductionUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    input: PosChemistryProductionDto[],
  ): Promise<PosChemistryProductionResponseDto[]> {
    const response: PosChemistryProductionResponseDto[] = [];

    for (const item of input) {
      const responseTechRateInfo: TechRateInfoDto[] = [];
      const period = `${item.dateStart.toLocaleString()} - ${item.dateEnd.toLocaleString()}`;

      for (const techRateInfo of item.techRateInfos) {
        const programs =
          await this.findMethodsDeviceProgramUseCase.getAllByFilter({
            posIds: [item.posId],
            programCode: techRateInfo.code,
            dateStart: item.dateStart,
            dateEnd: item.dateEnd,
          });

        const seconds = programs.reduce((acc, program) => {
          const second = Math.trunc(
            (program.endDate.getTime() - program.beginDate.getTime()) / 1000,
          );
          return acc + second;
        }, 0);

        const min = Math.round((100 * seconds) / 60) / 100;
        const recalculation = Math.round(100 * min * techRateInfo.coef) / 100;

        responseTechRateInfo.push({
          code: techRateInfo.code,
          spent: techRateInfo.spent.toString(),
          time: this.formatSecondsToTime(seconds),
          recalculation: recalculation.toString(),
          service: techRateInfo.service,
        });
      }

      response.push({
        techTaskId: item.techTaskId,
        period,
        techRateInfos: responseTechRateInfo,
      });
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
