import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';

export abstract class IReportTemplateTransactionRepository {
  abstract create(
    input: ReportTemplateTransaction,
  ): Promise<ReportTemplateTransaction>;
  abstract findAllByUserId(
    userId: number,
    skip?: number,
    take?: number,
  ): Promise<ReportTemplateTransaction[]>;
  abstract countAllByUserId(userId: number): Promise<number>;
  abstract update(
    input: ReportTemplateTransaction,
  ): Promise<ReportTemplateTransaction>;
}
