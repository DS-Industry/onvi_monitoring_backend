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
    this.logger.log('[PAYMENT-ORCHESTRATE] Consumer initialized');
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
    this.logger.log(`[PAYMENT-ORCHESTRATE] Processing job ${job.id} for order#${orderId}`);
    
    this.logger.log(`[PAYMENT-ORCHESTRATE] Building flow for order#${orderId}`);

    const order = await this.orderRepository.findOneById(orderId);
    if (!order) throw new Error('Order not found');

    await this.flowProducer.add({
      name: 'order-finished',
      queueName: 'order-finished',
      data: { orderId: order.id, transactionId },
      children: [
        {
          name: 'check-car-wash-started',
          queueName: 'check-car-wash-started',
          data: { orderId: order.id, carWashId, carWashDeviceId, bayType },
          opts: {
            ignoreDependencyOnFailure: true, 
            failParentOnFailure: false,
            attempts: 3,              
            backoff: {
              type: 'fixed',
              delay: 5000,           
            },
          },
          children: [
            {
              name: 'car-wash-launch',
              queueName: 'car-wash-launch',
              data: { orderId: order.id, carWashId, carWashDeviceId, bayType },
              opts: {
                ignoreDependencyOnFailure: true, 
                failParentOnFailure: false,
                attempts: 5,          
                backoff: {
                  type: 'fixed',
                  delay: 5000,        
                },
              },
            },
          ],
        },
      ],
    });
    
  }
}




