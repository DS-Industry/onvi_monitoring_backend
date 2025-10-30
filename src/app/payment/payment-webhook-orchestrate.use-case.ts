import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '@loyalty/order/repository/order';
import { OrderStatus } from '@prisma/client';
import { FlowProducer } from 'bullmq';

@Injectable()
export class PaymentWebhookOrchestrateUseCase {
  private readonly logger = new Logger(PaymentWebhookOrchestrateUseCase.name);
  private readonly flowProducer: FlowProducer;

  constructor(
    private readonly orderRepository: OrderRepository,
  ) {
    this.flowProducer = new FlowProducer({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    });
  }

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
      order.orderStatus = OrderStatus.PAYED;
      await this.orderRepository.update(order);

      await this.flowProducer.add({
        name: 'order-finished',
        queueName: 'order-finished',
        data: { orderId: order.id, transactionId: paymentId },
        children: [
          {
            name: 'pos-process',
            queueName: 'pos-process',
            data: {
              orderId: order.id,
              carWashId: order.carWashId,
              carWashDeviceId: order.carWashDeviceId,
              bayType: order.bayType,
            },
          }
        ],
      });
      this.logger.log(`Sent order#${order.id} to order-finished bull flow after payment.succeeded event.`);
      return;
    }

    order.orderStatus = OrderStatus.FAILED;
    await this.orderRepository.update(order);
    this.logger.warn(`Order#${order.id} set as FAILED due to event ${event}`);
  }
}
