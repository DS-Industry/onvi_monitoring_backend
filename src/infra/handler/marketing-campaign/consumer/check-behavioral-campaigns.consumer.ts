import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { CheckBehavioralCampaignsUseCase } from '@loyalty/mobile-user/order/use-cases/check-behavioral-campaigns.use-case';

@Processor('check-behavioral-campaigns')
@Injectable()
export class CheckBehavioralCampaignsConsumer extends WorkerHost {
  private readonly logger = new Logger(CheckBehavioralCampaignsConsumer.name);

  constructor(
    private readonly checkBehavioralCampaignsUseCase: CheckBehavioralCampaignsUseCase,
  ) {
    super();
    this.logger.log('[CHECK-BEHAVIORAL-CAMPAIGNS] Consumer initialized');
  }

  async process(job: Job<any>): Promise<string> {
    const { orderId } = job.data;
    const startTime = new Date().toISOString();
    
    this.logger.log(
      `[CHECK-BEHAVIORAL-CAMPAIGNS] [${startTime}] START - Job ${job.id} for order#${orderId}`,
    );

    try {
      await this.checkBehavioralCampaignsUseCase.execute(orderId);
      const endTime = new Date().toISOString();
      this.logger.log(
        `[CHECK-BEHAVIORAL-CAMPAIGNS] [${endTime}] END - Job ${job.id} completed successfully for order#${orderId}`,
      );
      return 'success';
    } catch (error: any) {
      const errorTime = new Date().toISOString();
      this.logger.error(
        `[CHECK-BEHAVIORAL-CAMPAIGNS] [${errorTime}] ERROR - Failed to process order#${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

