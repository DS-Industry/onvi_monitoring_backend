import { Injectable } from '@nestjs/common';
import { TransactionCreateDto } from '@report/transaction/use-cases/dto/transaction-create.dto';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';
import { IReportTemplateTransactionRepository } from '@report/transaction/interface/reportTemplateTransaction';
import { StatusReportTemplate } from '@prisma/client';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly reportTemplateTransactionRepository: IReportTemplateTransactionRepository,
  ) {}

  async execute(
    input: TransactionCreateDto,
  ): Promise<ReportTemplateTransaction> {
    const reportTemplateTransaction = new ReportTemplateTransaction({
      reportTemplateId: input.reportTemplateId,
      userId: input.userId,
      startTemplateAt: new Date(Date.now()),
      status: StatusReportTemplate.PROGRESS,
    });
    return await this.reportTemplateTransactionRepository.create(
      reportTemplateTransaction,
    );
  }
}
