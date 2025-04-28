import { Injectable } from '@nestjs/common';
import { FindMethodsWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-find-methods';
import { UpdateWorkDayShiftReportUseCase } from '@finance/shiftReport/workDayShiftReport/use-cases/workDayShiftReport-update';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { User } from '@platform-user/user/domain/user';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { StatusWorkDayShiftReport } from '@prisma/client';
import { CalculateWorkDayShiftReportCashOperUseCase } from '@finance/shiftReport/workDayShiftReportCashOper/use-cases/workDayShiftReportCashOper-calculate';

@Injectable()
export class SendWorkDayShiftReportUseCase {
  constructor(
    private readonly findMethodsWorkDayShiftReportUseCase: FindMethodsWorkDayShiftReportUseCase,
    private readonly updateWorkDayShiftReportUseCase: UpdateWorkDayShiftReportUseCase,
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly calculateWorkDayShiftReportCashOperUseCase: CalculateWorkDayShiftReportCashOperUseCase,
  ) {}

  async execute(
    workDayShiftReport: WorkDayShiftReport,
    user: User,
  ): Promise<WorkDayShiftReport> {
    const shiftReport = await this.findMethodsShiftReportUseCase.getOneById(
      workDayShiftReport.shiftReportId,
    );
    const oldWorkDayShift =
      await this.findMethodsWorkDayShiftReportUseCase.getLastByStatusSentAndPosId(
        shiftReport.posId,
        workDayShiftReport.workDate,
      );
    const cashOperData =
      await this.calculateWorkDayShiftReportCashOperUseCase.execute(
        workDayShiftReport.id,
      );
    return await this.updateWorkDayShiftReportUseCase.execute(
      {
        status: StatusWorkDayShiftReport.SENT,
        cashAtStart: oldWorkDayShift?.cashAtEnd || 0,
        cashAtEnd:
          oldWorkDayShift?.cashAtEnd +
            cashOperData.replenishmentSum -
            cashOperData.expenditureSum || 0,
      },
      workDayShiftReport,
      user,
    );
  }
}
