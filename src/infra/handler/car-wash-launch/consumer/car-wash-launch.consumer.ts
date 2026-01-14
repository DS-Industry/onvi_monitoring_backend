import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CarWashLaunchUseCase } from '@loyalty/mobile-user/order/use-cases/car-wash-launch.use-case';
import { Injectable, Logger } from '@nestjs/common';
import { CarWashLaunchJobData, JobResult } from '@infra/handler/shared/job-data.types';
import { JobValidationUtil } from '@infra/handler/shared/job-validation.util';

@Processor('car-wash-launch')
@Injectable()
export class CarWashLaunchConsumer extends WorkerHost {
  private readonly logger = new Logger(CarWashLaunchConsumer.name);

  constructor(private readonly carWashLaunchUseCase: CarWashLaunchUseCase) {
    super();
    this.logger.log('[CAR-WASH-LAUNCH] Consumer initialized');
  }

  async process(job: Job<CarWashLaunchJobData>): Promise<string> {
    const { orderId, carWashId, carWashDeviceId, bayType } = job.data;
    
    const startTime = JobValidationUtil.logJobStart(
      job.id,
      orderId,
      job.attemptsMade,
      job.opts?.attempts,
      job.parent?.id,
      { carWashId, carWashDeviceId, bayType },
      this.logger,
      'CAR-WASH-LAUNCH',
    );
    
    JobValidationUtil.validateRequiredFields(
      { orderId, carWashId, carWashDeviceId },
      ['orderId', 'carWashId', 'carWashDeviceId'],
      job.id || 'unknown',
      this.logger,
      'CAR-WASH-LAUNCH',
    );

    try {
      this.logger.log(
        `[CAR-WASH-LAUNCH] Executing carWashLaunchUseCase for order#${orderId}`,
      );
      
      await this.carWashLaunchUseCase.execute(
        orderId,
        carWashId,
        carWashDeviceId,
        bayType,
      );

      JobValidationUtil.logJobSuccess(
        job.id,
        orderId,
        startTime,
        this.logger,
        'CAR-WASH-LAUNCH',
      );
      
      return JobResult.SUCCESS;
    } catch (error: any) {
      JobValidationUtil.logJobError(
        error,
        job.id,
        orderId,
        job.attemptsMade,
        this.logger,
        'CAR-WASH-LAUNCH',
      );
      
      throw error;
    }
  }
}
