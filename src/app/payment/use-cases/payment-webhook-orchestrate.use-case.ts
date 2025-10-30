import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VerifyPaymentUseCaseCore } from '../../../core/payment-core/use-cases/verify-payment.use-case';

@Injectable()
export class PaymentWebhookOrchestrateUseCase {
  private readonly logger = new Logger(PaymentWebhookOrchestrateUseCase.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    @InjectQueue('payment-orchestrate') private readonly paymentOrchestrateQueue: Queue,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCaseCore,
  ) {}

  async execute(event: string, paymentId: string, data?: any) {
    const order = await this.orderRepository.findOneByTransactionId(paymentId);
    if (!order) return;

    this.logger.log(
      {
        orderId: order.id,
        action: `webhook_received_${event}`,
        timestamp: new Date(),
        details: JSON.stringify(data ?? { event, paymentId }),
      },
      `Received payment confirmation ${paymentId}`,
    );

    if (event === 'payment.canceled') {
      order.orderStatus = OrderStatus.CANCELED;
      await this.orderRepository.update(order);
      return;
    }

    if (event === 'payment.succeeded') {
      try { await this.verifyPaymentUseCase.execute(paymentId); } catch {}
      order.orderStatus = OrderStatus.PAYED;
      await this.orderRepository.update(order);

      await this.paymentOrchestrateQueue.add('payment-orchestrate', {
        orderId: order.id,
        transactionId: paymentId,
        carWashId: order.carWashId,
        carWashDeviceId: order.carWashDeviceId,
        bayType: order.bayType,
      });
      this.logger.log(`Sent order#${order.id} to order-finished bull flow after payment.succeeded event.`);
      return;
    }

    order.orderStatus = OrderStatus.FAILED;
    await this.orderRepository.update(order);
    this.logger.warn(`Order#${order.id} set as FAILED due to event ${event}`);
  }
}


