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
  }

  async process(job: Job<any>): Promise<void> {
    console.log("order-finished starteed")
    const { orderId } = job.data;
    this.logger.log(`[ORDER-FINISHED] Parent job ${job.id} for order#${orderId}`);
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) throw new Error('Order not found');

    const childrenResults = await job.getChildrenValues<any>();
    const posChild = Object.values(childrenResults)[0];

    if (posChild === 'success') {
      order.orderStatus = OrderStatus.COMPLETED;
      await this.orderRepository.update(order);
      this.logger.log(`[ORDER-FINISHED] Order#${orderId} marked as COMPLETED`);
    } else {
      order.orderStatus = OrderStatus.FAILED;
      await this.orderRepository.update(order);
      this.logger.warn(`[ORDER-FINISHED] Order#${orderId} marked as FAILED due to child error`);
    }
  }
}
