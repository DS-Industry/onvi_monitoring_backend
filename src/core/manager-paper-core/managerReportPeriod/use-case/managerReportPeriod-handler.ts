import { Injectable } from '@nestjs/common';
import { FindMethodsManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-find-methods';
import { CreateManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-create';

@Injectable()
export class HandlerManagerReportPeriodUseCase {
  constructor(
    private readonly findMethodsManagerReportPeriodUseCase: FindMethodsManagerReportPeriodUseCase,
    private readonly createManagerReportPeriodUseCase: CreateManagerReportPeriodUseCase,
  ) {}

  async execute(userIds: number[]): Promise<void> {
    const { firstDayOfLastMonth, startPeriod, endPeriod } =
      this.getPeriodDates();
    const todayUTC = new Date();

    for (const userId of userIds) {
      await this.processUser(
        userId,
        firstDayOfLastMonth,
        todayUTC,
        startPeriod,
        endPeriod,
      );
    }
  }

  private getPeriodDates(): {
    firstDayOfLastMonth: Date;
    startPeriod: Date;
    endPeriod: Date;
  } {
    const todayUTC = new Date();
    return {
      firstDayOfLastMonth: new Date(
        todayUTC.getFullYear(),
        todayUTC.getMonth() - 1,
        1,
      ),
      startPeriod: new Date(
        todayUTC.getFullYear(),
        todayUTC.getMonth(),
        2,
        0,
        0,
        0,
        0,
      ),
      endPeriod: new Date(
        todayUTC.getFullYear(),
        todayUTC.getMonth() + 1,
        1,
        23,
        59,
        59,
        999,
      ),
    };
  }

  private async processUser(
    userId: number,
    firstDayOfLastMonth: Date,
    todayUTC: Date,
    startPeriod: Date,
    endPeriod: Date,
  ): Promise<void> {
    const reportPeriods =
      await this.findMethodsManagerReportPeriodUseCase.getAllByFilter({
        userId: userId,
        dateStartPeriod: firstDayOfLastMonth,
        dateEndPeriod: todayUTC,
      });

    if (reportPeriods.length === 0) {
      await this.createManagerReportPeriodUseCase.execute({
        startPeriod,
        endPeriod,
        sumStartPeriod: 0,
        sumEndPeriod: 0,
        userId,
      });
    } else {
      const lastReport = reportPeriods[reportPeriods.length - 1];
      await this.createManagerReportPeriodUseCase.execute({
        startPeriod,
        endPeriod,
        sumStartPeriod: lastReport.sumEndPeriod,
        sumEndPeriod: 0,
        userId,
      });
    }
  }
}
