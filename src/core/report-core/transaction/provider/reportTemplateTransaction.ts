import { Provider } from '@nestjs/common';
import { IReportTemplateTransactionRepository } from '@report/transaction/interface/reportTemplateTransaction';
import { ReportTemplateTransactionRepository } from '@report/transaction/repository/reportTemplateTransaction';

export const ReportTemplateTransactionProvider: Provider = {
  provide: IReportTemplateTransactionRepository,
  useClass: ReportTemplateTransactionRepository,
};
