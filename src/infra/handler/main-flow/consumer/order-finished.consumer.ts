import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@prisma/client';

@Processor('order-finished')
@Injectable()
export class OrderFinishedConsumer extends WorkerHost {
  private readonly logger = new Logger(OrderFinishedConsumer.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {
    super();
    this.logger.log('[ORDER-FINISHED] Consumer initialized');
  }

  async process(job: Job<any>): Promise<void> {
    const { orderId } = job.data;
    this.logger.log(`[ORDER-FINISHED] Parent job ${job.id} for order#${orderId}`);
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      this.logger.error(`[ORDER-FINISHED] Order#${orderId} not found`);
      throw new Error('Order not found');
    }

    let childResult: any = null;
    let hasFailure = false;

    try {
      const childrenResults = await job.getChildrenValues<any>();
      const childResultsArray = Object.values(childrenResults);
      
      if (childResultsArray.length > 0) {
        childResult = childResultsArray[0];
        if (!childResult || childResult !== 'success') {
          hasFailure = true;
          this.logger.warn(
            `[ORDER-FINISHED] Child job failed for order#${orderId}. Result: ${JSON.stringify(childResult)}`,
          );
        }
      } else {
        hasFailure = true;
        this.logger.warn(`[ORDER-FINISHED] No child results found for order#${orderId} - child jobs failed`);
      }
    } catch (error: any) {
      hasFailure = true;
      this.logger.warn(
        `[ORDER-FINISHED] Child jobs failed for order#${orderId}: ${error.message}`,
      );
    }

    if (hasFailure) {
      order.orderStatus = OrderStatus.FAILED;
      await this.orderRepository.update(order);
      this.logger.warn(`[ORDER-FINISHED] Order#${orderId} marked as FAILED`);
    } else {
      order.orderStatus = OrderStatus.COMPLETED;
      await this.orderRepository.update(order);
      this.logger.log(`[ORDER-FINISHED] Order#${orderId} marked as COMPLETED`);
    }
  }
}
