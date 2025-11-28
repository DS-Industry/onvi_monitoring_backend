import { Injectable } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import {
  ProgramTechRateGeneratingMethodsResponseDto,
  TechRateInfoDto,
} from '@tech-task/programTechRate/use-cases/dto/programTechRate-generating-methods-response.dto';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { ShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-shape';
import { TechTaskShapeResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-shape-response.dto';
import { TECH_RATE_CODE } from '@constant/constants';
import { StatusTechTask } from '@prisma/client';

@Injectable()
export class GeneratingReportProgramTechRate {
  constructor(
    private readonly programTechRateRepository: IProgramTechRateRepository,
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly shapeTechTaskUseCase: ShapeTechTaskUseCase,
  ) {}

  async execute(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<ProgramTechRateGeneratingMethodsResponseDto[]> {
    dateStart.setDate(dateStart.getDate() - 1);
    const response: ProgramTechRateGeneratingMethodsResponseDto[] = [];
    const techTasks = await this.findMethodsTechTaskUseCase.getAllByFilter({
      posId: posId,
      gteStartDate: dateStart,
      lteStartDate: dateEnd,
      statuses: [StatusTechTask.FINISHED],
      codeTag: TECH_RATE_CODE,
    });
    if (techTasks.length <= 1) {
      return response;
    }

    const rateCodes = ['SOAP', 'PRESOAK', 'TIRE', 'BRUSH', 'WAX', 'TPOWER'];

    for (let i = 1; i < techTasks.length; i++) {
      const [lastTechReport, currentTechReport] = await Promise.all([
        this.shapeTechTaskUseCase.execute(techTasks[i - 1]),
        this.shapeTechTaskUseCase.execute(techTasks[i]),
      ]);

      const techRateInfos: TechRateInfoDto[] = [];

      for (const code of rateCodes) {
        const techRateInfo = await this.getTechRateInfoSafe(
          code,
          lastTechReport,
          currentTechReport,
        );

        if (techRateInfo) {
          techRateInfos.push(techRateInfo);
        }
      }

      if (techRateInfos.length > 0) {
        response.push({
          techTaskId: techTasks[i].id,
          posId: techTasks[i].posId,
          dateStart: techTasks[i - 1].startWorkDate,
          dateEnd: techTasks[i].startWorkDate,
          techRateInfos: techRateInfos,
        });
      }
    }

    return response;
  }

  private async getTechRateInfoSafe(
    code: string,
    lastTechReport: TechTaskShapeResponseDto,
    currentTechReport: TechTaskShapeResponseDto,
  ): Promise<TechRateInfoDto | null> {
    const hasRequiredParams =
      this.hasItem(lastTechReport, `${code}_LEVEL`) &&
      this.hasItem(currentTechReport, `${code}_LEVEL`) &&
      this.hasItem(lastTechReport, `${code}_ADD`);

    if (!hasRequiredParams) {
      return null;
    }

    const oldLevel = this.getItemValue(lastTechReport, `${code}_LEVEL`);
    const currentLevel = this.getItemValue(currentTechReport, `${code}_LEVEL`);
    const oldAdd = this.getItemValue(lastTechReport, `${code}_ADD`);

    const spent = oldLevel - currentLevel + oldAdd;

    const coef =
      await this.programTechRateRepository.findOneByCWPosIdAndProgramTypeCode(
        currentTechReport.posId,
        code,
      );

    if (!coef) {
      return null;
    }

    return {
      code: code,
      spent: spent,
      coef: coef.literRate / coef.concentration,
      service: '-',
    };
  }

  private hasItem(report: TechTaskShapeResponseDto, code: string): boolean {
    return report.items.some((item) => item.code === code);
  }

  private getItemValue(report: TechTaskShapeResponseDto, code: string): number {
    const item = report.items.find((item) => item.code === code);
    return item ? Number(item.value) || 0 : 0;
  }
}
