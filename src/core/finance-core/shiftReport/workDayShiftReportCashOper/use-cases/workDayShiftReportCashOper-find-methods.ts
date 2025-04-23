import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/interface/workDayShiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';
import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';

@Injectable()
export class FindMethodsWorkDayShiftReportCashOperUseCase {
  constructor(
    private readonly workDayShiftReportCashOperRepository: IWorkDayShiftReportCashOperRepository,
  ) {}

  async getAllByWorkDayIdAndType(
    workDayShiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<WorkDayShiftReportCashOper[]> {
    return await this.workDayShiftReportCashOperRepository.findAllByWorkDayIdAndType(
      workDayShiftReportId,
      type,
    );
  }
}
