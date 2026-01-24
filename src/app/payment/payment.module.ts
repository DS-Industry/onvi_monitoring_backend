import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { OrderProvider } from '@loyalty/order/provider/order';
import { PaymentService } from './payment.service';
import { PaymentController } from './controller/payment.controller';
import { PaymentWebhookController } from './controller/payment-webhook.controller';
import { YooKassaGateway } from '../../infra/payment/gateways/yookassa.gateway';
import { PaymentWebhookOrchestrateUseCase } from './use-cases/payment-webhook-orchestrate.use-case';
import { VerifyWebhookIpUseCase } from './use-cases/verify-webhook-ip.use-case';
import { GetGatewayCredentialsUseCase } from './use-cases/get-gateway-credentials.use-case';
import { CreatePaymentUseCaseCore } from '../../core/payment-core/use-cases/create-payment.use-case';
import { VerifyPaymentUseCaseCore } from '../../core/payment-core/use-cases/verify-payment.use-case';
import { RefundPaymentUseCaseCore } from '../../core/payment-core/use-cases/refund-payment.use-case';
import { QueueModule } from '@infra/queue/queue.module';

@Module({
  imports: [
    forwardRef(() => LoyaltyCoreModule),
    PrismaModule,
    QueueModule,
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'payment-orchestrate',
      defaultJobOptions: {
        removeOnComplete: false, 
        removeOnFail: false,
        attempts: 3,
      },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'order-finished',
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'car-wash-launch',
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'check-car-wash-started',
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'apply-marketing-campaign-rewards',
    }),
  ],
  providers: [
    OrderProvider,
    PaymentService,
    CreatePaymentUseCaseCore,
    VerifyPaymentUseCaseCore,
    RefundPaymentUseCaseCore,
    PaymentWebhookOrchestrateUseCase,
    VerifyWebhookIpUseCase,
    GetGatewayCredentialsUseCase,
    YooKassaGateway,
    { provide: 'PAYMENT_GATEWAY', useClass: YooKassaGateway },
  ],
  controllers: [PaymentController, PaymentWebhookController],
  exports: [PaymentService, CreatePaymentUseCaseCore, VerifyPaymentUseCaseCore, GetGatewayCredentialsUseCase],
})
export class PaymentModule {}
