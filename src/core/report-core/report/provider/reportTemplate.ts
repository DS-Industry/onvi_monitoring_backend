import { Provider } from '@nestjs/common';
import { IReportTemplateRepository } from '@report/report/interface/reportTemplate';
import { ReportTemplateRepository } from '@report/report/repository/reportTemplate';

export const ReportTemplateRepositoryProvider: Provider = {
  provide: IReportTemplateRepository,
  useClass: ReportTemplateRepository,
};
