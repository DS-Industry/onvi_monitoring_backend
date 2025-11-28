import { Injectable } from '@nestjs/common';
import { IShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/interface/shiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

@Injectable()
export class CalculateShiftReportCashOperUseCase {
  constructor(
    private readonly shiftReportCashOperRepository: IShiftReportCashOperRepository,
  ) {}

  async execute(
    shiftReportId: number,
  ): Promise<{ replenishmentSum: number; expenditureSum: number }> {
    const workDayShiftReportCashOper =
      await this.shiftReportCashOperRepository.findAllByShiftReportId(
        shiftReportId,
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
