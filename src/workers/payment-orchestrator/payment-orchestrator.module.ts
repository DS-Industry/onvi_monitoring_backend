import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@db/prisma/prisma.module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PaymentOrchestrateConsumer } from '@infra/handler/payment-orchestrate/consumer/payment-orchestrate.consumer';

@Module({
  imports: [
    PrismaModule,
    LoyaltyCoreModule,
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'payment-orchestrate',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 3 },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'order-finished',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 1 },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'pos-process',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 3 },
    }),
  ],
  providers: [PaymentOrchestrateConsumer],
})
export class PaymentOrchestratorModule {}



