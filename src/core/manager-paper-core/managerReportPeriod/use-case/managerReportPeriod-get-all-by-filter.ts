import { Injectable } from '@nestjs/common';
import { FindMethodsManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-find-methods';
import {
  ManagerReportPeriodsResponseDto,
  ReportPeriodResponse,
} from '@platform-user/core-controller/dto/response/managerReportPeriods-response.dto';
import { GetAllByFilterDto } from '@manager-paper/managerReportPeriod/use-case/dto/get-all-by-filter.dto';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { ManagerPaperTypeClass } from '@prisma/client';
import { ManagerPaperWithTypeDto } from '@manager-paper/managerPaper/use-case/dto/managerPaperWithType.dto';

@Injectable()
export class GetAllByFilterManagerReportPeriodUseCase {
  constructor(
    private readonly findMethodsManagerReportPeriodUseCase: FindMethodsManagerReportPeriodUseCase,
    private readonly findMethodsManagerPaperUseCase: FindMethodsManagerPaperUseCase,
  ) {}

  async execute(
    data: GetAllByFilterDto,
  ): Promise<ManagerReportPeriodsResponseDto> {
    const [totalCount, managerPeriods] = await Promise.all([
      this.findMethodsManagerReportPeriodUseCase.getCountByFilter({
        dateStartPeriod: data.startPeriod,
        dateEndPeriod: data.endPeriod,
        userId: data.userId,
      }),
      this.findMethodsManagerReportPeriodUseCase.getAllByFilter({
        dateStartPeriod: data.startPeriod,
        dateEndPeriod: data.endPeriod,
        userId: data.userId,
        skip: data.skip,
        take: data.take,
      }),
    ]);

    const reportPeriods: ReportPeriodResponse[] = [];

    for (const managerPeriod of managerPeriods) {
      const managerPapers =
        await this.findMethodsManagerPaperUseCase.getAllByFilterWithType({
          userId: managerPeriod.userId,
          dateStartEvent: managerPeriod.startPeriod,
          dateEndEvent: managerPeriod.endPeriod,
        });

      const { receiptSum, expenditureSum } =
        this.calculatePaperSums(managerPapers);

      const shortage =
        managerPeriod.sumEndPeriod -
        receiptSum +
        expenditureSum -
        managerPeriod.sumStartPeriod;
      const periodString = `${this.formatDate(managerPeriod.startPeriod)} - ${this.formatDate(managerPeriod.endPeriod)}`;

      reportPeriods.push({
        id: managerPeriod.id,
        period: periodString,
        sumStartPeriod: managerPeriod.sumStartPeriod,
        sumEndPeriod: managerPeriod.sumEndPeriod,
        shortage: shortage,
        userId: managerPeriod.userId,
        status: managerPeriod.status,
      });
    }

    return {
      managerReportPeriods: reportPeriods,
      totalCount: totalCount,
    };
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private calculatePaperSums(managerPapers: ManagerPaperWithTypeDto[]): {
    receiptSum: number;
    expenditureSum: number;
  } {
    let receiptSum = 0;
    let expenditureSum = 0;

    for (const paper of managerPapers) {
      if (paper.paperTypeType === ManagerPaperTypeClass.RECEIPT) {
        receiptSum += paper.sum;
      } else if (paper.paperTypeType === ManagerPaperTypeClass.EXPENDITURE) {
        expenditureSum += paper.sum;
      }
    }

    return { receiptSum, expenditureSum };
  }
}
