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
    this.logger.log(
      `[APPLY-MARKETING-CAMPAIGN-REWARDS] Processing job ${job.id} for order#${orderId}`,
    );

    try {
      await this.applyMarketingCampaignRewardsUseCase.execute(orderId);
      this.logger.log(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] Job ${job.id} completed successfully for order#${orderId}`,
      );
      return 'success';
    } catch (error: any) {
      this.logger.error(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] Failed to process order#${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

