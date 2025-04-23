import { ReportTemplate } from '@report/report/domain/reportTemplate';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';

export class ReportApplyDto {
  report: ReportTemplate;
  paramsArray: any[];
  transaction?: ReportTemplateTransaction;
}
