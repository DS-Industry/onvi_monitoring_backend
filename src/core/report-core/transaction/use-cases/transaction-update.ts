import { Injectable } from '@nestjs/common';
import { IReportTemplateTransactionRepository } from '@report/transaction/interface/reportTemplateTransaction';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';
import { TransactionUpdateDto } from '@report/transaction/use-cases/dto/transaction-update.dto';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    private readonly reportTemplateTransactionRepository: IReportTemplateTransactionRepository,
  ) {}

  async execute(
    input: TransactionUpdateDto,
    oldTransaction: ReportTemplateTransaction,
  ): Promise<ReportTemplateTransaction> {
    const { reportKey, status } = input;

    oldTransaction.reportKey = reportKey ? reportKey : oldTransaction.reportKey;
    oldTransaction.status = status ? status : oldTransaction.status;
    oldTransaction.endTemplateAt = new Date(Date.now());

    return await this.reportTemplateTransactionRepository.update(
      oldTransaction,
    );
  }
}
