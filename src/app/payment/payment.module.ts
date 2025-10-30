import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { YooKassaGateway } from './yookassa.gateway';
import { PaymentWebhookOrchestrateUseCase } from './payment-webhook-orchestrate.use-case';

@Module({
  providers: [
    PaymentService,
    PaymentWebhookOrchestrateUseCase,
    YooKassaGateway,
    { provide: 'PAYMENT_GATEWAY', useClass: YooKassaGateway },
  ],
  controllers: [PaymentController, PaymentWebhookController],
  exports: [PaymentService],
})
export class PaymentModule {}
