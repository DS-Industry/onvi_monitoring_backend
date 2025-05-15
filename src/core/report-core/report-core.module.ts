import { Module, Provider } from '@nestjs/common';
import { ReportTemplateRepositoryProvider } from '@report/report/provider/reportTemplate';
import { PrismaModule } from '@db/prisma/prisma.module';
import { ApplyReportUseCase } from '@report/report/use-cases/report-apply';
import { FindMethodsReportUseCase } from '@report/report/use-cases/report-find-methods';
import { HandlerReportUseCase } from '@report/report/use-cases/report-handler';
import { BullModule } from '@nestjs/bullmq';
import { FileModule } from '@libs/file/module';
import { ReportTemplateTransactionProvider } from '@report/transaction/provider/reportTemplateTransaction';
import { CreateTransactionUseCase } from '@report/transaction/use-cases/transaction-create';
import { UpdateTransactionUseCase } from '@report/transaction/use-cases/transaction-update';
import { FindMethodsTransactionUseCase } from '@report/transaction/use-cases/transaction-find-methods';
import { ReportTemplateConsumer } from "../../infra/handler/reportTemplate/comsumer/report-template.consumer";

const repositories: Provider[] = [
  ReportTemplateRepositoryProvider,
  ReportTemplateTransactionProvider,
];

const reportUseCase: Provider[] = [
  ApplyReportUseCase,
  FindMethodsReportUseCase,
  HandlerReportUseCase,
];

const transactionUseCase: Provider[] = [
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
  FindMethodsTransactionUseCase,
];
@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'reportTemplate',
    }),
    FileModule,
  ],
  providers: [...repositories, ...reportUseCase, ...transactionUseCase],
  exports: [...reportUseCase, ...transactionUseCase],
})
export class ReportCoreModule {}
