import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ApplyMarketingCampaignRewardsUseCase } from '@loyalty/mobile-user/order/use-cases/apply-marketing-campaign-rewards.use-case';
import { ApplyMarketingCampaignRewardsJobData, JobResult } from '@infra/handler/shared/job-data.types';
import { JobValidationUtil } from '@infra/handler/shared/job-validation.util';

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

  async process(job: Job<ApplyMarketingCampaignRewardsJobData>): Promise<string> {
    const { orderId } = job.data;
    const parentId = job.parent?.id;
    const parentKey = job.parentKey;
    
    const startTime = JobValidationUtil.logJobStart(
      job.id,
      orderId,
      job.attemptsMade,
      job.opts?.attempts,
      parentId,
      { parentKey: parentKey || 'none' },
      this.logger,
      'APPLY-MARKETING-CAMPAIGN-REWARDS',
    );
    
    JobValidationUtil.validateRequiredField(
      orderId,
      'orderId',
      job.id || 'unknown',
      this.logger,
      'APPLY-MARKETING-CAMPAIGN-REWARDS',
    );
    
    this.validateParentJob(parentId, job.id);

    try {
      this.logger.log(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] Executing applyMarketingCampaignRewardsUseCase for order#${orderId}`,
      );
      
      await this.applyMarketingCampaignRewardsUseCase.execute(orderId);
      
      JobValidationUtil.logJobSuccess(
        job.id,
        orderId,
        startTime,
        this.logger,
        'APPLY-MARKETING-CAMPAIGN-REWARDS',
      );
      
      return JobResult.SUCCESS;
    } catch (error: any) {
      JobValidationUtil.logJobError(
        error,
        job.id,
        orderId,
        job.attemptsMade,
        this.logger,
        'APPLY-MARKETING-CAMPAIGN-REWARDS',
      );
      
      throw error;
    }
  }

  private validateParentJob(parentId: string | undefined, jobId: string | undefined): void {
    if (!parentId) {
      this.logger.warn(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] WARNING: Job ${jobId} has no parent. This job should be a child of car-wash-launch.`,
      );
    } else {
      this.logger.log(
        `[APPLY-MARKETING-CAMPAIGN-REWARDS] Parent job ${parentId} completed successfully, proceeding with marketing campaign rewards`,
      );
    }
  }
}

