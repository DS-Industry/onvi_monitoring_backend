import { Injectable } from '@nestjs/common';
import { CalculateWorkDayShiftReportCashOperUseCase } from '@finance/shiftReport/workDayShiftReportCashOper/use-cases/workDayShiftReportCashOper-calculate';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { DayShiftReportOperDataResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-oper-data-response.dto';

@Injectable()
export class GetOperDataWorkDayShiftReportUseCase {
  constructor(
    private readonly calculateWorkDayShiftReportCashOperUseCase: CalculateWorkDayShiftReportCashOperUseCase,
  ) {}

  async execute(
    workDayShiftReport: WorkDayShiftReport,
  ): Promise<DayShiftReportOperDataResponseDto> {
    const cashOperData =
      await this.calculateWorkDayShiftReportCashOperUseCase.execute(
        workDayShiftReport.id,
      );
    return {
      cashAtStart: workDayShiftReport.cashAtStart,
      replenishmentSum: cashOperData.replenishmentSum,
      expenditureSum: cashOperData.expenditureSum,
      cashAtEnd:
        workDayShiftReport.cashAtStart +
        cashOperData.replenishmentSum -
        cashOperData.expenditureSum,
    };
  }
}
