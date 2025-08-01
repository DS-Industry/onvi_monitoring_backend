import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { User } from '@platform-user/user/domain/user';
import { FindMethodsShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-find-methods';
import { CalculateShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-calculate';
import { UpdateShiftReportUseCase } from '@finance/shiftReport/shiftReport/use-cases/shiftReport-update';
import { StatusWorkDayShiftReport } from '@prisma/client';
import { Injectable } from "@nestjs/common";
@Injectable()
export class SendShiftReportUseCase {
  constructor(
    private readonly findMethodsShiftReportUseCase: FindMethodsShiftReportUseCase,
    private readonly calculateShiftReportCashOperUseCase: CalculateShiftReportCashOperUseCase,
    private readonly updateShiftReportUseCase: UpdateShiftReportUseCase,
  ) {}

  async execute(shiftReport: ShiftReport, user: User): Promise<ShiftReport> {
    const lastShiftReport =
      await this.findMethodsShiftReportUseCase.getLastByStatusSentAndPosId(
        shiftReport.posId,
        shiftReport.workDate,
      );
    const cashOperData = await this.calculateShiftReportCashOperUseCase.execute(
      shiftReport.id,
    );
    return await this.updateShiftReportUseCase.execute(
      {
        status: StatusWorkDayShiftReport.SENT,
        cashAtStart: lastShiftReport?.cashAtEnd || 0,
        cashAtEnd:
          lastShiftReport?.cashAtEnd +
            cashOperData.replenishmentSum -
            cashOperData.expenditureSum || 0,
      },
      shiftReport,
      user,
    );
  }
}
