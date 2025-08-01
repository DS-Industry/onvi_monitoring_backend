import { Injectable } from '@nestjs/common';
import { IShiftReportCashOperRepository } from '@finance/shiftReport/shiftReportCashOper/interface/shiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';
import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';

@Injectable()
export class FindMethodsShiftReportCashOperUseCase {
  constructor(
    private readonly workDayShiftReportCashOperRepository: IShiftReportCashOperRepository,
  ) {}

  async getAllByWorkDayIdAndType(
    shiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<ShiftReportCashOper[]> {
    return await this.workDayShiftReportCashOperRepository.findAllByShiftReportIdAndType(
      shiftReportId,
      type,
    );
  }
}
