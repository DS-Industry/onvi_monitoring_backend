import { Injectable } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import {
  ProgramTechRateGeneratingMethodsResponseDto,
  TechRateInfoDto,
} from '@tech-task/programTechRate/use-cases/dto/programTechRate-generating-methods-response.dto';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { TypeTechTask } from '@prisma/client';
import { ShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-shape';
import { TechTaskShapeResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-shape-response.dto';

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
    const techTasks =
      await this.findMethodsTechTaskUseCase.getAllAllByTypeAndPosIdAndDate(
        posId,
        TypeTechTask.Routine,
        dateStart,
        dateEnd,
      );
    if (techTasks.length > 1) {
      for (let i = 1; i < techTasks.length; i++) {
        const lastTechReport = await this.shapeTechTaskUseCase.execute(
          techTasks[i - 1],
        );
        const currentTechReport = await this.shapeTechTaskUseCase.execute(
          techTasks[i],
        );

        const soap = await this.techRateInfoByCode(
          'SOAP',
          lastTechReport,
          currentTechReport,
        );
        const presoak = await this.techRateInfoByCode(
          'PRESOAK',
          lastTechReport,
          currentTechReport,
        );
        const tire = await this.techRateInfoByCode(
          'TIRE',
          lastTechReport,
          currentTechReport,
        );
        const brush = await this.techRateInfoByCode(
          'BRUSH',
          lastTechReport,
          currentTechReport,
        );
        const wax = await this.techRateInfoByCode(
          'WAX',
          lastTechReport,
          currentTechReport,
        );
        const tpower = await this.techRateInfoByCode(
          'TPOWER',
          lastTechReport,
          currentTechReport,
        );

        response.push({
          techTaskId: techTasks[i].id,
          posId: posId,
          dateStart: techTasks[i - 1].startWorkDate,
          dateEnd: techTasks[i].startWorkDate,
          techRateInfos: [soap, presoak, tire, brush, wax, tpower],
        });
      }
    }
    return response;
  }

  async techRateInfoByCode(
    code: string,
    lastTechReport: TechTaskShapeResponseDto,
    currentTechReport: TechTaskShapeResponseDto,
  ): Promise<TechRateInfoDto> {
    const oldLevel = lastTechReport.items.find(
      (item) => item.code === code + '_LEVEL',
    );
    const currentLevel = currentTechReport.items.find(
      (item) => item.code === code + '_LEVEL',
    );
    const oldAdd = lastTechReport.items.find(
      (item) => item.code === code + '_ADD',
    );

    const spent =
      Number(oldLevel.value) -
      Number(currentLevel.value) +
      Number(oldAdd.value);

    const coef =
      await this.programTechRateRepository.findOneByCWPosIdAndProgramTypeCode(
        currentTechReport.posId,
        code,
      );

    return {
      code: code,
      spent: spent,
      coef: coef.literRate / coef.concentration,
      service: '-',
    };
  }
}
