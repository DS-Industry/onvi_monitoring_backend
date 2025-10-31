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

  async execute(event: string, paymentId: string, data?: any, requestId?: string) {
    const order = await this.orderRepository.findOneByTransactionId(paymentId);
    
    if (!order) {
      this.logger.warn(
        `Webhook received for unknown order. Payment ID: ${paymentId}, Event: ${event}, Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    this.logger.log(
      {
        orderId: order.id,
        action: `webhook_received_${event}`,
        timestamp: new Date(),
        paymentId,
        requestId,
        details: JSON.stringify(data ?? { event, paymentId }),
      },
      `Received payment confirmation ${paymentId} for order#${order.id}`,
    );

    if (event === 'payment.canceled') {
      if (order.orderStatus === OrderStatus.CANCELED) {
        this.logger.log(
          `Webhook already processed for order#${order.id}. Order already canceled. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      order.orderStatus = OrderStatus.CANCELED;
      await this.orderRepository.update(order);
      this.logger.log(`Order#${order.id} canceled via webhook. Request ID: ${requestId || 'unknown'}`);
      return;
    }

    if (event === 'payment.succeeded') {
      if (order.orderStatus === OrderStatus.PAYED) {
        this.logger.log(
          `Webhook already processed for order#${order.id}. Order already paid. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      try {
        const payment = await this.verifyPaymentUseCase.execute(paymentId);
        
        if (payment.status !== 'succeeded') {
          this.logger.warn(
            `Payment ${paymentId} status mismatch: expected 'succeeded', got '${payment.status}'. Order#${order.id}. Request ID: ${requestId || 'unknown'}`,
          );
          return;
        }

        this.logger.log(`Payment ${paymentId} verified successfully for order#${order.id}`);
      } catch (error) {
        this.logger.error(
          `Payment verification failed for payment ${paymentId}, order#${order.id}: ${error.message}. Request ID: ${requestId || 'unknown'}`,
        );
        throw error;
      }

      order.orderStatus = OrderStatus.PAYED;
      await this.orderRepository.update(order);

      await this.paymentOrchestrateQueue.add(
        'payment-orchestrate',
        {
          orderId: order.id,
          transactionId: paymentId,
          carWashId: order.carWashId,
          carWashDeviceId: order.carWashDeviceId,
          bayType: order.bayType,
        },
        {
          jobId: `payment-orchestrate-${order.id}`,
        },
      );

      this.logger.log(
        `Sent order#${order.id} to payment-orchestrate queue after payment.succeeded event. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    this.logger.warn(
      `Unhandled webhook event: ${event} for order#${order.id}, payment ${paymentId}. Request ID: ${requestId || 'unknown'}`,
    );
    order.orderStatus = OrderStatus.FAILED;
    await this.orderRepository.update(order);
  }
}


