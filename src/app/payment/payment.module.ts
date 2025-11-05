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
import { VerifyWebhookSignatureUseCase } from './use-cases/verify-webhook-signature.use-case';
import { CreatePaymentUseCaseCore } from '../../core/payment-core/use-cases/create-payment.use-case';
import { VerifyPaymentUseCaseCore } from '../../core/payment-core/use-cases/verify-payment.use-case';
import { RefundPaymentUseCaseCore } from '../../core/payment-core/use-cases/refund-payment.use-case';

@Module({
  imports: [
    forwardRef(() => LoyaltyCoreModule),
    PrismaModule,
    BullModule.registerQueue({ configKey: 'worker', name: 'payment-orchestrate' }),
  ],
  providers: [
    OrderProvider,
    PaymentService,
    CreatePaymentUseCaseCore,
    VerifyPaymentUseCaseCore,
    RefundPaymentUseCaseCore,
    PaymentWebhookOrchestrateUseCase,
    VerifyWebhookSignatureUseCase,
    YooKassaGateway,
    { provide: 'PAYMENT_GATEWAY', useClass: YooKassaGateway },
  ],
  controllers: [PaymentController, PaymentWebhookController],
  exports: [PaymentService, CreatePaymentUseCaseCore, VerifyPaymentUseCaseCore],
})
export class PaymentModule {}
