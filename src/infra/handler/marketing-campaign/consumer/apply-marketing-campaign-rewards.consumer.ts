import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ApplyMarketingCampaignRewardsUseCase } from '@loyalty/mobile-user/order/use-cases/apply-marketing-campaign-rewards.use-case';

@Processor('apply-marketing-campaign-rewards')
@Injectable()
export class ApplyMarketingCampaignRewardsConsumer extends WorkerHost {
  private readonly logger = new Logger(ApplyMarketingCampaignRewardsConsumer.name);

  constructor(
    private readonly applyMarketingCampaignRewardsUseCase: ApplyMarketingCampaignRewardsUseCase,
  ) {
    super();
    this.logger.log('[APPLY-MARKETING-CAMPAIGN-REWARDS] Consumer initialized');
  }

  async process(job: Job<any>): Promise<string> {
    const { orderId } = job.data;
    const startTime = new Date().toISOString();
    
    // Log parent job information for debugging
    const parentId = job.parent?.id;
    const parentKey = job.parentKey;
    this.logger.log(
      `[APPLY-MARKETING-CAMPAIGN-REWARDS] [${startTime}] START - Job ${job.id} for order#${orderId}. Parent ID: ${parentId || 'none'}, ParentKey: ${parentKey || 'none'}`,
    );
    
    // In BullMQ flows, child jobs should only run after parent completes
    // If this job is running before car-wash-launch, there's a flow configuration issue
    if (!parentId) {
      this.logger.warn(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] WARNING: Job ${job.id} has no parent. This job should be a child of car-wash-launch.`,
      );
    }

    try {
      await this.applyMarketingCampaignRewardsUseCase.execute(orderId);
      const endTime = new Date().toISOString();
      this.logger.log(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] [${endTime}] END - Job ${job.id} completed successfully for order#${orderId}`,
      );
      return 'success';
    } catch (error: any) {
      const errorTime = new Date().toISOString();
      this.logger.error(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] [${errorTime}] ERROR - Failed to process order#${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

