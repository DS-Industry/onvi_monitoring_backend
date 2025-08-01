import { Injectable } from '@nestjs/common';
import { CalculateShiftReportCashOperUseCase } from '@finance/shiftReport/shiftReportCashOper/use-cases/shiftReportCashOper-calculate';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { DayShiftReportOperDataResponseDto } from '@platform-user/core-controller/dto/response/day-shift-report-oper-data-response.dto';

@Injectable()
export class GetOperDataShiftReportUseCase {
  constructor(
    private readonly calculateShiftReportCashOperUseCase: CalculateShiftReportCashOperUseCase,
  ) {}

  async execute(
    shiftReport: ShiftReport,
  ): Promise<DayShiftReportOperDataResponseDto> {
    const cashOperData = await this.calculateShiftReportCashOperUseCase.execute(
      shiftReport.id,
    );
    return {
      cashAtStart: shiftReport.cashAtStart,
      replenishmentSum: cashOperData.replenishmentSum,
      expenditureSum: cashOperData.expenditureSum,
      cashAtEnd:
        shiftReport.cashAtStart +
        cashOperData.replenishmentSum -
        cashOperData.expenditureSum,
    };
  }
}
