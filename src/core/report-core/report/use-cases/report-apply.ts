import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ReportApplyDto } from '@platform-user/validate/validate-rules/dto/report-apply.dto';
import { User } from '@platform-user/user/domain/user';
import { CreateTransactionUseCase } from '@report/transaction/use-cases/transaction-create';
import { ReportTemplateTransaction } from '@report/transaction/domain/reportTemplateTransaction';

@Injectable()
export class ApplyReportUseCase {
  constructor(
    @InjectQueue('reportTemplate') private readonly dataQueue: Queue,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async execute(
    handlerData: ReportApplyDto,
    user: User,
  ): Promise<ReportTemplateTransaction> {
    const transaction = await this.createTransactionUseCase.execute({
      reportTemplateId: handlerData.report.id,
      userId: user.id,
    });
    handlerData.transaction = transaction;
    await this.dataQueue.add('reportTemplate', handlerData, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    return transaction;
  }
}
