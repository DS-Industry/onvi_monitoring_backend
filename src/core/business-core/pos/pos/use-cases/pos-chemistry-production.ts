import { Injectable } from '@nestjs/common';
import { PosChemistryProductionDto } from '@pos/pos/use-cases/dto/pos-chemistry-production.dto';
import {
  PosChemistryProductionResponseDto,
  TechRateInfoDto,
} from '@pos/pos/use-cases/dto/pos-chemistry-production-response.dto';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { format } from 'date-fns';
import {
  DeviceProgramFullDataResponseDto
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto";

@Injectable()
export class PosChemistryProductionUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    input: PosChemistryProductionDto[],
  ): Promise<PosChemistryProductionResponseDto[]> {
    const response: PosChemistryProductionResponseDto[] = [];

    const queries: { posId: number; code: string }[] = [];
    input.forEach(item => {
      item.techRateInfos.forEach(tri => {
        queries.push({ posId: item.posId, code: tri.code });
      });
    });

    const allPrograms = await this.findMethodsDeviceProgramUseCase.getAllByFilter({
      posIds: Array.from(new Set(queries.map(q => q.posId))),
      programCodes: Array.from(new Set(queries.map(q => q.code))),
      dateStart: new Date(Math.min(...input.map(i => i.dateStart.getTime()))),
      dateEnd: new Date(Math.max(...input.map(i => i.dateEnd.getTime()))),
    });

    const programsMap = new Map<string, DeviceProgramFullDataResponseDto[]>();
    allPrograms.forEach(p => {
      const key = `${p.posId}-${p.programCode}`;
      if (!programsMap.has(key)) programsMap.set(key, []);
      programsMap.get(key).push(p);
    });

    for (const item of input) {
      const responseTechRateInfo: TechRateInfoDto[] = [];
      const period = `${format(item.dateStart, 'dd.MM.yyyy, HH:mm:ss')} - ${format(item.dateEnd, 'dd.MM.yyyy, HH:mm:ss')}`;

      for (const tri of item.techRateInfos) {
        const key = `${item.posId}-${tri.code}`;
        const programs = programsMap.get(key) || [];

        const relevantPrograms = programs.filter(p => p.endDate >= item.dateStart && p.beginDate <= item.dateEnd);

        const seconds = relevantPrograms.reduce((acc, program) => {
          const begin = program.beginDate < item.dateStart ? item.dateStart : program.beginDate;
          const end = program.endDate > item.dateEnd ? item.dateEnd : program.endDate;
          return acc + Math.trunc((end.getTime() - begin.getTime()) / 1000);
        }, 0);

        const min = Math.round((100 * seconds) / 60) / 100;
        const recalculation = Math.round(100 * min * tri.coef) / 100;

        responseTechRateInfo.push({
          code: tri.code,
          spent: tri.spent.toString(),
          time: this.formatSecondsToTime(seconds),
          recalculation: recalculation.toString(),
          service: tri.service,
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
