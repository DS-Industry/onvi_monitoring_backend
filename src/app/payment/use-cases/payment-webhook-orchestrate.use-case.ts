import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus, PlatformType } from '@loyalty/order/domain/enums';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { VerifyPaymentUseCaseCore } from '../../../core/payment-core/use-cases/verify-payment.use-case';
import { YooKassaWebhookDto } from '../dto/webhook.dto';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { FindMethodsCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-find-methods';
import {
  CASHBACK_BONUSES_OPER_TYPE_ID,
  MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
  USING_BONUSES_OPER_TYPE_ID,
} from '@constant/constants';
import { IPromoCodeRepository } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';
import { MarketingCampaignDiscountService } from '@loyalty/order/domain/services';
import { ICardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/interface/cardBonusOper';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';

@Injectable()
export class PaymentWebhookOrchestrateUseCase {
  private readonly logger = new Logger(PaymentWebhookOrchestrateUseCase.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    @InjectQueue('payment-orchestrate')
    private readonly paymentOrchestrateQueue: Queue,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCaseCore,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
    private readonly findMethodsCardBonusOperUseCase: FindMethodsCardBonusOperUseCase,
    @Inject(IPromoCodeRepository)
    private readonly promoCodeRepository: IPromoCodeRepository,
    private readonly marketingCampaignDiscountService: MarketingCampaignDiscountService,
    @Inject(ICardBonusOperRepository)
    private readonly cardBonusOperRepository: ICardBonusOperRepository,
  ) {
    this.logger.log(
      `[WEBHOOK] PaymentWebhookOrchestrateUseCase initialized. Queue name: payment-orchestrate`,
    );
  }

  async execute(
    event: string,
    paymentId: string,
    data?: YooKassaWebhookDto,
    requestId?: string,
  ) {
    let order = await this.orderRepository.findOneByTransactionId(paymentId);

    if (!order && data?.object?.metadata) {
      const orderIdFromMetadata =
        data.object.metadata.orderId ||
        data.object.metadata.order_id;

      if (orderIdFromMetadata) {
        const orderId = parseInt(
          String(orderIdFromMetadata),
          10,
        );
        if (!isNaN(orderId)) {
          try {
            order = await this.orderRepository.findOneById(orderId);
            this.logger.log(
              `Found order ${orderId} by metadata for payment ${paymentId}. Request ID: ${requestId || 'unknown'}`,
            );
          } catch (error) {
            this.logger.warn(
              `Order ${orderId} from metadata not found. Request ID: ${requestId || 'unknown'}`,
            );
          }
        }
      }
    }

    if (!order) {
      this.logger.warn(
        `Webhook received for unknown order. Payment ID: ${paymentId}, Event: ${event}, Metadata: ${JSON.stringify(data?.object?.metadata || {})}, Request ID: ${requestId || 'unknown'}`,
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

      const updatedOrder = await this.orderRepository.updateStatusIf(
        order.id,
        order.orderStatus,
        OrderStatus.CANCELED,
      );

      if (!updatedOrder) {
        this.logger.log(
          `Webhook already processed by concurrent request or order status changed for order#${order.id}. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      this.logger.log(
        `Order#${order.id} canceled via webhook. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    if (event === 'payment.succeeded') {
      if (order.orderStatus === OrderStatus.PAYED) {
        this.logger.log(
          `Webhook already processed for order#${order.id}. Order already paid. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      if (order.orderStatus !== OrderStatus.WAITING_PAYMENT) {
        this.logger.warn(
          `Order ${order.id} in invalid state for payment.succeeded webhook: ${order.orderStatus}. Expected WAITING_PAYMENT. Request ID: ${requestId || 'unknown'}`,
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

        this.logger.log(
          `Payment ${paymentId} verified successfully for order#${order.id}`,
        );
      } catch (error) {
        this.logger.error(
          `Payment verification failed for payment ${paymentId}, order#${order.id}: ${error.message}. Request ID: ${requestId || 'unknown'}`,
        );
        throw error;
      }

      const updatedOrder = await this.orderRepository.updateStatusIf(
        order.id,
        OrderStatus.WAITING_PAYMENT,
        OrderStatus.PAYED,
      );

      if (!updatedOrder) {
        this.logger.log(
          `Webhook already processed by concurrent request for order#${order.id}. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      const verifiedOrder = await this.orderRepository.findOneById(order.id);
      if (!verifiedOrder) {
        this.logger.error(
          `Order#${order.id} not found after status update. Cannot create job. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      try {
        await this.applyBonusOperations(verifiedOrder, requestId);
      } catch (bonusError: any) {
        this.logger.error(
          `[WEBHOOK] Failed to apply bonus operations for order#${verifiedOrder.id}: ${bonusError.message}. Request ID: ${requestId || 'unknown'}`,
          bonusError.stack,
        );
      }

      try {
        await this.trackVisitCountsForPaidOrder(verifiedOrder, requestId);
      } catch (trackingError: any) {
        this.logger.error(
          `[WEBHOOK] Failed to track visit counts for order#${verifiedOrder.id}: ${trackingError.message}. Request ID: ${requestId || 'unknown'}`,
          trackingError.stack,
        );
      }

      const jobData = {
        orderId: verifiedOrder.id,
        transactionId: paymentId,
        carWashId: verifiedOrder.carWashId,
        carWashDeviceId: verifiedOrder.carWashDeviceId,
        bayType: verifiedOrder.bayType,
      };
      
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const jobId = `payment-orchestrate-${order.id}-${paymentId}-${timestamp}-${random}`;
      
      const existingJob = await this.paymentOrchestrateQueue.getJob(jobId);
      if (existingJob) {
        const existingState = await existingJob.getState();
        this.logger.warn(
          `[WEBHOOK] Job ${jobId} already exists with state: ${existingState}. Removing it before creating new one.`,
        );
        try {
          await existingJob.remove();
        } catch (removeError: any) {
          this.logger.warn(
            `[WEBHOOK] Could not remove existing job: ${removeError.message}`,
          );
        }
      }
      
      const queueName = this.paymentOrchestrateQueue.name;
      const queueClient = (this.paymentOrchestrateQueue as any).client;
      const redisHost = queueClient?.options?.host || 'unknown';
      const redisPort = queueClient?.options?.port || 'unknown';
      
      this.logger.log(
        `[WEBHOOK] Queue connection: ${queueName} -> Redis ${redisHost}:${redisPort}`,
      );
      this.logger.log(
        `[WEBHOOK] Adding job to payment-orchestrate queue. Job ID: ${jobId}, Data: ${JSON.stringify(jobData)}`,
      );
      
      let job;
      try {
        job = await this.paymentOrchestrateQueue.add(
          'payment-orchestrate',
          jobData,
          {
            jobId,
            removeOnComplete: false,
            removeOnFail: false, 
            attempts: 3, 
          },
        );

        this.logger.log(
          `[WEBHOOK] Job added successfully. Job ID: ${job.id}, Order#${order.id}, Payment ID: ${paymentId}. Request ID: ${requestId || 'unknown'}`,
        );
      } catch (addError: any) {
        this.logger.error(
          `[WEBHOOK] ❌ Failed to add job to queue: ${addError.message}`,
          addError.stack,
        );
        throw addError;
      }
      
      try {
        const jobState = await job.getState();
        this.logger.log(
          `[WEBHOOK] Job ${job.id} state after 100ms: ${jobState}`,
        );
        
        const jobFromQueue = await this.paymentOrchestrateQueue.getJob(job.id);
        if (jobFromQueue) {
          const queueState = await jobFromQueue.getState();
          const jobData = jobFromQueue.data;
          const jobProgress = jobFromQueue.progress;
          const jobAttempts = jobFromQueue.attemptsMade;
          const failedReason = jobFromQueue.failedReason;
          const stacktrace = jobFromQueue.stacktrace;
          const processedOn = jobFromQueue.processedOn;
          const finishedOn = jobFromQueue.finishedOn;
          
          this.logger.log(
            `[WEBHOOK] Verified job exists in queue. State: ${queueState}, Attempts: ${jobAttempts}, Progress: ${jobProgress}, Processed: ${processedOn ? new Date(processedOn).toISOString() : 'never'}, Finished: ${finishedOn ? new Date(finishedOn).toISOString() : 'never'}`,
          );
          
          if (queueState === 'failed') {
            this.logger.error(
              `[WEBHOOK] ❌ Job ${job.id} FAILED! Reason: ${failedReason || 'Unknown'}`,
            );
            if (stacktrace && stacktrace.length > 0) {
              this.logger.error(
                `[WEBHOOK] Stack trace: ${JSON.stringify(stacktrace)}`,
              );
            }
            this.logger.warn(
              `[WEBHOOK] ⚠️ Job failed - check worker logs for details. If worker is not running, this job will remain failed.`,
            );
          } else if (queueState === 'completed') {
            this.logger.log(
              `[WEBHOOK] ✅ Job ${job.id} completed successfully`,
            );
          } else if (queueState === 'active') {
            this.logger.log(
              `[WEBHOOK] ⏳ Job ${job.id} is ACTIVE - worker is processing it`,
            );
          }
          
          const counts = await this.paymentOrchestrateQueue.getJobCounts();
          this.logger.log(
            `[WEBHOOK] Queue counts - Waiting: ${counts.waiting}, Active: ${counts.active}, Completed: ${counts.completed}, Failed: ${counts.failed}, Delayed: ${counts.delayed}`,
          );
          
          if (queueState === 'active' && counts.active === 0) {
            this.logger.warn(
              `[WEBHOOK] ⚠️ DISCREPANCY: Job shows as 'active' but queue counts show 0 active jobs. This may indicate the job was processed very quickly or there's a state sync issue.`,
            );
          }
        } else {
          this.logger.warn(
            `[WEBHOOK] WARNING: Job ${job.id} not found when querying queue! It may have been removed (check removeOnComplete/removeOnFail settings).`,
          );
        }
      } catch (stateError: any) {
        this.logger.warn(
          `[WEBHOOK] Could not get job state: ${stateError?.message || stateError}`,
        );
      }
      return;
    }

    if (event === 'payment.waiting_for_capture') {
      this.logger.log(
        `Payment ${paymentId} is waiting for capture for order#${order.id}. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    this.logger.warn(
      `Unhandled webhook event: ${event} for order#${order.id}, payment ${paymentId}. Request ID: ${requestId || 'unknown'}`,
    );
  }

  private async applyBonusOperations(order: any, requestId?: string) {
    if (order.platform !== PlatformType.ONVI) {
      return;
    }

    if (!order.clientId) {
      this.logger.warn(
        `[WEBHOOK] Order#${order.id} has no clientId. Skipping бонусные операции. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    const card = await this.findMethodsCardUseCase.getByClientId(order.clientId);
    if (!card) {
      this.logger.warn(
        `[WEBHOOK] Card for client ${order.clientId} not found for order#${order.id}. Skipping бонусные операции. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    if (order.sumBonus > 0) {
      const existingDeduction =
        await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
          order.id,
          USING_BONUSES_OPER_TYPE_ID,
        );
      if (!existingDeduction) {
        await this.createCardBonusOperUseCase.execute(
          {
            carWashDeviceId: order.carWashDeviceId,
            typeOperId: USING_BONUSES_OPER_TYPE_ID,
            operDate: order.orderData,
            sum: order.sumBonus,
            orderMobileUserId: order.id,
          },
          card,
        );
        this.logger.log(
          `[WEBHOOK] Created bonus deduction (type ${USING_BONUSES_OPER_TYPE_ID}) for order#${order.id}, sum ${order.sumBonus}. Request ID: ${requestId || 'unknown'}`,
        );
      } else {
        this.logger.log(
          `[WEBHOOK] Bonus deduction already exists for order#${order.id}. Skipping. Request ID: ${requestId || 'unknown'}`,
        );
      }
    }

    if (order.sumCashback > 0) {
      const existingCashback =
        await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
          order.id,
          CASHBACK_BONUSES_OPER_TYPE_ID,
        );
      if (!existingCashback) {
        await this.createCardBonusOperUseCase.execute(
          {
            carWashDeviceId: order.carWashDeviceId,
            typeOperId: CASHBACK_BONUSES_OPER_TYPE_ID,
            operDate: order.orderData,
            sum: order.sumCashback,
            orderMobileUserId: order.id,
          },
          card,
        );
        this.logger.log(
          `[WEBHOOK] Created cashback bonus (type ${CASHBACK_BONUSES_OPER_TYPE_ID}) for order#${order.id}, sum ${order.sumCashback}. Request ID: ${requestId || 'unknown'}`,
        );
      } else {
        this.logger.log(
          `[WEBHOOK] Cashback bonus already exists for order#${order.id}. Skipping. Request ID: ${requestId || 'unknown'}`,
        );
      }
    }

    if (order.sumDiscount > 0) {
      const marketingUsage =
        await this.promoCodeRepository.findDiscountUsageByOrderId(order.id);
      if (marketingUsage) {
        const existingMarketingBonus =
          await this.findMethodsCardBonusOperUseCase.getByOrderIdAndType(
            order.id,
            MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
          );
        if (!existingMarketingBonus) {
          const marketingBonusOper = new CardBonusOper({
            cardMobileUserId: card.id,
            carWashDeviceId: order.carWashDeviceId,
            typeOperId: MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID,
            operDate: order.orderData,
            loadDate: new Date(),
            sum: order.sumDiscount,
            orderMobileUserId: order.id,
          });
          await this.cardBonusOperRepository.create(marketingBonusOper);
          this.logger.log(
            `[WEBHOOK] Created marketing campaign bonus record (type ${MARKETING_CAMPAIGN_BONUSES_OPER_TYPE_ID}) for order#${order.id}, sum ${order.sumDiscount}. Request ID: ${requestId || 'unknown'}`,
          );
        } else {
          this.logger.log(
            `[WEBHOOK] Marketing campaign bonus already exists for order#${order.id}. Skipping. Request ID: ${requestId || 'unknown'}`,
          );
        }
      }
    }
  }

  private async trackVisitCountsForPaidOrder(order: any, requestId?: string) {
    if (order.platform !== PlatformType.ONVI) {
      return;
    }

    if (!order.clientId) {
      this.logger.warn(
        `[WEBHOOK] Order#${order.id} has no clientId. Skipping visit count tracking. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    if (!order.carWashId) {
      this.logger.warn(
        `[WEBHOOK] Order#${order.id} has no carWashId. Skipping visit count tracking. Request ID: ${requestId || 'unknown'}`,
      );
      return;
    }

    try {
      const card = await this.findMethodsCardUseCase.getByClientId(order.clientId);
      if (!card) {
        this.logger.warn(
          `[WEBHOOK] Card for client ${order.clientId} not found for order#${order.id}. Skipping visit count tracking. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      const eligibleCampaigns =
        await this.marketingCampaignDiscountService.findEligibleDiscountCampaigns(
          order.clientId,
          order.orderData,
          order.carWashId,
        );

      if (eligibleCampaigns.length === 0) {
        this.logger.debug(
          `[WEBHOOK] No eligible campaigns found for order#${order.id}. Skipping visit count tracking. Request ID: ${requestId || 'unknown'}`,
        );
        return;
      }

      await this.marketingCampaignDiscountService.trackVisitCountsForEligibleCampaigns(
        eligibleCampaigns,
        order.clientId,
        order.orderData,
        order.sumFull,
        card.id,
      );

      this.logger.log(
        `[WEBHOOK] Tracked visit counts for ${eligibleCampaigns.length} eligible campaigns for order#${order.id}. Request ID: ${requestId || 'unknown'}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[WEBHOOK] Error tracking visit counts for order#${order.id}: ${error.message}. Request ID: ${requestId || 'unknown'}`,
        error.stack,
      );
      throw error;
    }
  }
}
