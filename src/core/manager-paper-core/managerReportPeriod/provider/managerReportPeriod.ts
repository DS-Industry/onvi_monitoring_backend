import { Provider } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { ManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/repository/managerReportPeriod';

export const ManagerReportPeriodRepositoryProvider: Provider = {
  provide: IManagerReportPeriodRepository,
  useClass: ManagerReportPeriodRepository,
};
