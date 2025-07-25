import { Injectable } from '@nestjs/common';
import { FindMethodsManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-find-methods';
import {
  ManagerReportPeriodsResponseDto,
  ReportPeriodResponse,
} from '@platform-user/core-controller/dto/response/managerReportPeriods-response.dto';
import { GetAllByFilterDto } from '@manager-paper/managerReportPeriod/use-case/dto/get-all-by-filter.dto';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { ManagerPaperTypeClass } from '@prisma/client';

@Injectable()
export class GetAllByFilterManagerReportPeriodUseCase {
  constructor(
    private readonly findMethodsManagerReportPeriodUseCase: FindMethodsManagerReportPeriodUseCase,
    private readonly findMethodsManagerPaperUseCase: FindMethodsManagerPaperUseCase,
  ) {}

  async execute(
    data: GetAllByFilterDto,
  ): Promise<ManagerReportPeriodsResponseDto> {
    const totalCount =
      await this.findMethodsManagerReportPeriodUseCase.getCountByFilter({
        dateStartPeriod: data.startPeriod,
        dateEndPeriod: data.endPeriod,
        userId: data.userId,
      });
    const managerPeriods =
      await this.findMethodsManagerReportPeriodUseCase.getAllByFilter({
        dateStartPeriod: data.startPeriod,
        dateEndPeriod: data.endPeriod,
        userId: data.userId,
        skip: data.skip,
        take: data.take,
      });

    const reportPeriods = await Promise.all(
      managerPeriods.map(async (managerPeriod) => {
        const managerPapers =
          await this.findMethodsManagerPaperUseCase.getAllByFilterWithType({
            userId: managerPeriod.userId,
            dateStartEvent: managerPeriod.startPeriod,
            dateEndEvent: managerPeriod.endPeriod,
          });

        let receiptSum = 0;
        let expenditureSum = 0;

        managerPapers.forEach((paper) => {
          if (paper.paperTypeType === ManagerPaperTypeClass.RECEIPT) {
            receiptSum += paper.sum;
          } else if (
            paper.paperTypeType === ManagerPaperTypeClass.EXPENDITURE
          ) {
            expenditureSum += paper.sum;
          }
        });

        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}.${month}.${year}`;
        };
        const periodString = `${formatDate(managerPeriod.startPeriod)} - ${formatDate(managerPeriod.endPeriod)}`;

        const shortage =
          managerPeriod.sumEndPeriod -
          receiptSum +
          expenditureSum -
          managerPeriod.sumStartPeriod;

        return {
          id: managerPeriod.id,
          period: periodString,
          sumStartPeriod: managerPeriod.sumStartPeriod,
          sumEndPeriod: managerPeriod.sumEndPeriod,
          shortage: shortage,
          userId: managerPeriod.userId,
          status: managerPeriod.status,
        } as ReportPeriodResponse;
      }),
    );
    return {
      managerReportPeriods: reportPeriods,
      totalCount: totalCount,
    };
  }
}
