import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import {
  IFlowProducer,
  IFLOW_PRODUCER,
} from '@loyalty/order/interface/flow-producer.interface';
import { PrismaService } from '@db/prisma/prisma.service';

@Processor('payment-orchestrate')
@Injectable()
export class PaymentOrchestrateConsumer extends WorkerHost {
  private readonly logger = new Logger(PaymentOrchestrateConsumer.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    @Inject(IFLOW_PRODUCER)
    private readonly flowProducer: IFlowProducer,
    private readonly prisma: PrismaService,
  ) {
    super();
    this.logger.log('[PAYMENT-ORCHESTRATE] Consumer initialized');
  }

  async process(job: Job<any>): Promise<void> {
    const { orderId, transactionId, carWashId, carWashDeviceId, bayType } =
      job.data || {};
    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Processing job ${job.id} for order#${orderId}`,
    );

    this.logger.log(`[PAYMENT-ORCHESTRATE] Building flow for order#${orderId}`);

    const order = await this.orderRepository.findOneById(orderId);
    if (!order) throw new Error('Order not found');

    const noDiscountApplied = order.sumDiscount === 0;
    
    const promocodeUsage = await this.prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: order.id,
        promocodeId: { not: null },
      },
    });
    const noPromoCodeUsed = !promocodeUsage;

    const carWashLaunchChildren: any[] = [];
    if (noDiscountApplied && noPromoCodeUsed) {
      this.logger.log(
        `[PAYMENT-ORCHESTRATE] Adding apply-marketing-campaign-rewards as child of car-wash-launch for order#${order.id}`,
      );
      carWashLaunchChildren.push({
        name: 'apply-marketing-campaign-rewards',
        queueName: 'apply-marketing-campaign-rewards',
        data: { orderId: order.id },
        opts: {
          failParentOnFailure: false,
          // Child jobs in BullMQ flows automatically wait for parent to complete
          // Removing ignoreDependencyOnFailure ensures proper dependency chain
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000,
          },
        },
      });
    }

    const children: any[] = [
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
            children: carWashLaunchChildren,
          },
        ],
      },
    ];

    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Creating flow for order#${order.id}. Structure: order-finished -> check-car-wash-started -> car-wash-launch${carWashLaunchChildren.length > 0 ? ' -> apply-marketing-campaign-rewards' : ''}`,
    );

    await this.flowProducer.add({
      name: 'order-finished',
      queueName: 'order-finished',
      data: { orderId: order.id, transactionId },
      children,
    });

    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Flow created successfully for order#${order.id}. Each job in the flow will run in a separate worker, with proper dependency chain enforcement.`,
    );
  }
}
