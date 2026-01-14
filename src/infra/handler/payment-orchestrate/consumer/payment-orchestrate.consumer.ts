import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import {
  IFlowProducer,
  IFLOW_PRODUCER,
  FlowJobConfig,
} from '@loyalty/order/interface/flow-producer.interface';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  PaymentOrchestrateJobData,
} from '@infra/handler/shared/job-data.types';
import { JobValidationUtil } from '@infra/handler/shared/job-validation.util';
import { Order } from '@loyalty/order/domain/order';

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

  async process(job: Job<PaymentOrchestrateJobData>): Promise<void> {
    const { orderId, transactionId, carWashId, carWashDeviceId, bayType } =
      job.data;
    
    const startTime = JobValidationUtil.logJobStart(
      job.id,
      orderId,
      job.attemptsMade,
      job.opts?.attempts,
      job.parent?.id,
      { transactionId, carWashId, carWashDeviceId, bayType },
      this.logger,
      'PAYMENT-ORCHESTRATE',
    );

    JobValidationUtil.validateRequiredFields(
      { orderId, transactionId },
      ['orderId', 'transactionId'],
      job.id || 'unknown',
      this.logger,
      'PAYMENT-ORCHESTRATE',
    );

    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Validated input for order#${orderId}`,
    );

    const order = await this.validateAndFetchOrder(orderId, job.id);
    const shouldAddMarketingRewards = await this.shouldAddMarketingCampaignRewards(order);
    const flowChildren = this.buildFlowChildren(
      order,
      carWashId,
      carWashDeviceId,
      bayType,
      shouldAddMarketingRewards,
    );

    await this.createFlow(order, transactionId, flowChildren, job);
  }

  private async validateAndFetchOrder(
    orderId: number,
    jobId: string | undefined,
  ): Promise<Order> {
    this.logger.log(`[PAYMENT-ORCHESTRATE] Fetching order#${orderId} from repository`);

    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      const error = new Error(`Order#${orderId} not found`);
      this.logger.error(
        `[PAYMENT-ORCHESTRATE] ERROR - ${error.message} | Job ${jobId}`,
      );
      throw error;
    }

    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Order#${order.id} found. Status: ${order.orderStatus}, Discount: ${order.sumDiscount}`,
    );

    return order;
  }

  private async shouldAddMarketingCampaignRewards(
    order: Order,
  ): Promise<boolean> {
    const noDiscountApplied = order.sumDiscount === 0;
    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Checking promocode usage for order#${order.id}`,
    );
    
    const promocodeUsage = await this.prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId: order.id,
        promocodeId: { not: null },
      },
    });
    const noPromoCodeUsed = !promocodeUsage;

    this.logger.log(
      `[PAYMENT-ORCHESTRATE] Promocode check: noDiscountApplied=${noDiscountApplied}, noPromoCodeUsed=${noPromoCodeUsed}`,
    );

    return noDiscountApplied && noPromoCodeUsed;
  }

  private buildFlowChildren(
    order: Order,
    carWashId: number,
    carWashDeviceId: number,
    bayType: any,
    shouldAddMarketingRewards: boolean,
  ): FlowJobConfig[] {
    const carWashLaunchChildren: FlowJobConfig[] = [];
    
    if (shouldAddMarketingRewards) {
      this.logger.log(
        `[PAYMENT-ORCHESTRATE] Conditions met - Adding apply-marketing-campaign-rewards as child of car-wash-launch for order#${order.id}`,
      );
      carWashLaunchChildren.push({
        name: 'apply-marketing-campaign-rewards',
        queueName: 'apply-marketing-campaign-rewards',
        data: { orderId: order.id },
        opts: {
          failParentOnFailure: false,
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000,
          },
        },
      });
    } else {
      this.logger.log(
        `[PAYMENT-ORCHESTRATE] Skipping marketing campaign rewards - discount applied or promocode used`,
      );
    }

    const children: FlowJobConfig[] = [
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
      `[PAYMENT-ORCHESTRATE] Building flow structure for order#${order.id}. Flow: order-finished -> check-car-wash-started -> car-wash-launch${carWashLaunchChildren.length > 0 ? ' -> apply-marketing-campaign-rewards' : ''}`,
    );

    return children;
  }

  private async createFlow(
    order: Order,
    transactionId: string,
    children: FlowJobConfig[],
    job: Job<PaymentOrchestrateJobData>,
  ): Promise<void> {
    try {
      this.logger.log(
        `[PAYMENT-ORCHESTRATE] Calling flowProducer.add() for order#${order.id}`,
      );
      
      await this.flowProducer.add({
        name: 'order-finished',
        queueName: 'order-finished',
        data: { orderId: order.id, transactionId },
        children,
      });

      const endTime = new Date().toISOString();
      this.logger.log(
        `[PAYMENT-ORCHESTRATE] [${endTime}] SUCCESS - Flow created successfully for order#${order.id}. Flow will execute: order-finished -> check-car-wash-started -> car-wash-launch${children[0]?.children?.[0]?.children?.length ? ' -> apply-marketing-campaign-rewards' : ''}`,
      );
    } catch (error: any) {
      const errorTime = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error(
        `[PAYMENT-ORCHESTRATE] [${errorTime}] CRITICAL ERROR - Failed to create flow for order#${order.id}. Error: ${errorMessage} | Job ${job.id} | Attempt ${job.attemptsMade || 0}`,
        errorStack,
      );
      
      throw new Error(
        `Failed to create flow for order#${order.id}: ${errorMessage}`,
      );
    }
  }
}
