import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FlowProducer } from 'bullmq';

@Processor('payment-orchestrate')
@Injectable()
export class PaymentOrchestrateConsumer extends WorkerHost {
  private readonly logger = new Logger(PaymentOrchestrateConsumer.name);
  private readonly flowProducer: FlowProducer;

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {
    super();
    this.flowProducer = new FlowProducer({
      connection: {
        host: process.env.REDIS_WORKER_DATA_HOST || process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_WORKER_DATA_PORT || process.env.REDIS_PORT || '6379', 10),
        username: process.env.REDIS_WORKER_DATA_USER,
        password: process.env.REDIS_WORKER_DATA_PASSWORD,
      },
    });
  }

  async process(job: Job<any>): Promise<void> {
    const { orderId, transactionId, carWashId, carWashDeviceId, bayType } = job.data || {};
    this.logger.log(`[PAYMENT-ORCHESTRATE] Building flow for order#${orderId}`);

    const order = await this.orderRepository.findOneById(orderId);
    if (!order) throw new Error('Order not found');

    await this.flowProducer.add({
      name: 'order-finished',
      queueName: 'order-finished',
      data: { orderId: order.id, transactionId },
      children: [
        {
          name: 'pos-process',
          queueName: 'pos-process',
          data: { orderId: order.id, carWashId, carWashDeviceId, bayType },
        },
      ],
    });
  }
}




