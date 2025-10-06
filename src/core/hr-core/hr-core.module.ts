import { Module, Provider } from '@nestjs/common';
import { WorkerRepositoryProvider } from '@hr/worker/provider/worker';
import { PrismaModule } from '@db/prisma/prisma.module';
import { FileModule } from '@libs/file/module';
import { PositionRepositoryProvider } from '@hr/position/provider/position';
import { CreateWorkerUseCase } from '@hr/worker/use-case/worker-create';
import { FindMethodsWorkerUseCase } from '@hr/worker/use-case/worker-find-methods';
import { UpdateWorkerUseCase } from '@hr/worker/use-case/worker-update';
import { ConnectionWorkerPosUseCase } from '@hr/worker/use-case/worker-pos-connection';
import { CreatePositionUseCase } from '@hr/position/use-case/position-create';
import { UpdatePositionUseCase } from '@hr/position/use-case/position-update';
import { FindMethodsPositionUseCase } from '@hr/position/use-case/position-find-methods';
import { PaymentRepositoryProvider } from '@hr/payment/provider/payment';
import { CreatePaymentUseCase } from '@hr/payment/use-case/payment-create';
import { FindMethodsPaymentUseCase } from '@hr/payment/use-case/payment-find-methods';
import { CalculatePaymentUseCase } from "@hr/payment/use-case/payment-calculate";
import { GetReportPaymentUseCase } from "@hr/payment/use-case/payment-get-report";
import { FinanceCoreModule } from '@finance/finance-core.module';

const repositories: Provider[] = [
  WorkerRepositoryProvider,
  PositionRepositoryProvider,
  PaymentRepositoryProvider,
];

const workerUseCases: Provider[] = [
  CreateWorkerUseCase,
  FindMethodsWorkerUseCase,
  UpdateWorkerUseCase,
  ConnectionWorkerPosUseCase,
];

const positionUseCases: Provider[] = [
  CreatePositionUseCase,
  UpdatePositionUseCase,
  FindMethodsPositionUseCase,
];

const paymentUseCases: Provider[] = [
  CreatePaymentUseCase,
  FindMethodsPaymentUseCase,
  CalculatePaymentUseCase,
  GetReportPaymentUseCase,
];
@Module({
  imports: [PrismaModule, FileModule, FinanceCoreModule],
  providers: [
    ...repositories,
    ...workerUseCases,
    ...positionUseCases,
    ...paymentUseCases,
  ],
  exports: [...workerUseCases, ...positionUseCases, ...paymentUseCases],
})
export class HrCoreModule {}
