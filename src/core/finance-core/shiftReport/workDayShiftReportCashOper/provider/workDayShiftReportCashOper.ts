import { Provider } from '@nestjs/common';
import { IWorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/interface/workDayShiftReportCashOper';
import { WorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/repository/workDayShiftReportCashOper';

export const WorkDayShiftReportCashOperRepositoryProvider: Provider = {
  provide: IWorkDayShiftReportCashOperRepository,
  useClass: WorkDayShiftReportCashOperRepository,
};
