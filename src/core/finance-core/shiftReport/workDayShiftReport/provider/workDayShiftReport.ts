import { Provider } from '@nestjs/common';
import { WorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/repository/workDayShiftReport';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';

export const WorkDayShiftReportRepositoryProvider: Provider = {
  provide: IWorkDayShiftReportRepository,
  useClass: WorkDayShiftReportRepository,
};
