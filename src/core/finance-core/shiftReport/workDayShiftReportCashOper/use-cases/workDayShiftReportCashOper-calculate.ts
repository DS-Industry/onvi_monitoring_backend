import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/interface/workDayShiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

@Injectable()
export class CalculateWorkDayShiftReportCashOperUseCase {
  constructor(
    private readonly workDayShiftReportCashOperRepository: IWorkDayShiftReportCashOperRepository,
  ) {}

  async execute(
    workDayShiftReportId: number,
  ): Promise<{ replenishmentSum: number; expenditureSum: number }> {
    const workDayShiftReportCashOper =
      await this.workDayShiftReportCashOperRepository.findAllByWorkDayId(
        workDayShiftReportId,
      );

    const replenishmentSum = workDayShiftReportCashOper
      .filter(
        (oper) => oper.type === TypeWorkDayShiftReportCashOper.REPLENISHMENT,
      )
      .reduce((sum, oper) => sum + oper.sum, 0);

    const expenditureSum = workDayShiftReportCashOper
      .filter((oper) => oper.type === TypeWorkDayShiftReportCashOper.REFUND)
      .reduce((sum, oper) => sum + oper.sum, 0);

    return {
      replenishmentSum,
      expenditureSum,
    };
  }
}
