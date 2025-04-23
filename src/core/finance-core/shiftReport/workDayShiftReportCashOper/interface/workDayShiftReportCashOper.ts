import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

export abstract class IWorkDayShiftReportCashOperRepository {
  abstract create(
    input: WorkDayShiftReportCashOper,
  ): Promise<WorkDayShiftReportCashOper>;
  abstract findAllByWorkDayId(
    workDayShiftReportId: number,
  ): Promise<WorkDayShiftReportCashOper[]>;
  abstract findAllByWorkDayIdAndType(
    workDayShiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<WorkDayShiftReportCashOper[]>;
}
