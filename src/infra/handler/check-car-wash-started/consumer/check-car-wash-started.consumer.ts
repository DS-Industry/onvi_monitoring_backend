import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckCarWashStartedUseCase } from '@loyalty/mobile-user/order/use-cases/check-car-wash-started.use-case';
import { Injectable, Logger } from '@nestjs/common';
import { CheckCarWashStartedJobData, JobResult } from '@infra/handler/shared/job-data.types';
import { JobValidationUtil } from '@infra/handler/shared/job-validation.util';

@Processor('check-car-wash-started')
@Injectable()
export class CheckCarWashStartedConsumer extends WorkerHost {
  private readonly logger = new Logger(CheckCarWashStartedConsumer.name);

  constructor(
    private readonly checkCarWashStartedUseCase: CheckCarWashStartedUseCase,
  ) {
    super();
    this.logger.log('[CHECK-CAR-WASH-STARTED] Consumer initialized');
  }

  async process(job: Job<CheckCarWashStartedJobData>): Promise<string> {
    const { orderId, carWashId, carWashDeviceId, bayType } = job.data;
    
    this.logger.log(
      `[CHECK-CAR-WASH-STARTED] ====== PROCESS METHOD CALLED ====== Job ID: ${job.id}, Order ID: ${orderId}`,
    );
    
    const startTime = JobValidationUtil.logJobStart(
      job.id,
      orderId,
      job.attemptsMade,
      job.opts?.attempts,
      job.parent?.id,
      { carWashId, carWashDeviceId, bayType },
      this.logger,
      'CHECK-CAR-WASH-STARTED',
    );
    
    JobValidationUtil.validateRequiredField(
      orderId,
      'orderId',
      job.id || 'unknown',
      this.logger,
      'CHECK-CAR-WASH-STARTED',
    );
    
    this.logger.log(
      `[CHECK-CAR-WASH-STARTED] Job ${job.id} parent: ${job.parent?.id || 'none'}, parentKey: ${job.parentKey || 'none'}`,
    );
    
    const carWashLaunchSuccess = await this.checkChildJobResult(job, orderId);

    if (carWashLaunchSuccess) {
      return await this.executeCheckCarWashStarted(
        orderId,
        carWashId,
        carWashDeviceId,
        bayType,
        job,
      );
    } else {
      const endTime = new Date().toISOString();
      this.logger.warn(
        `[CHECK-CAR-WASH-STARTED] [${endTime}] SKIPPED - Job ${job.id} skipped - car-wash-launch did not succeed for order#${orderId}`,
      );
      return JobResult.SKIPPED;
    }
  }

  private async checkChildJobResult(
    job: Job<CheckCarWashStartedJobData>,
    orderId: number,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `[CHECK-CAR-WASH-STARTED] Waiting for child job (car-wash-launch) to complete...`,
      );
      
      const childrenResults = await job.getChildrenValues<string>();
      const childResultsArray = Object.values(childrenResults);
      const childKeys = Object.keys(childrenResults);

      this.logger.log(
        `[CHECK-CAR-WASH-STARTED] Received ${childResultsArray.length} child result(s). Child jobs: ${childKeys.join(', ')}`,
      );

      if (childResultsArray.length > 0) {
        const childResult = childResultsArray[0];
        const success = childResult === JobResult.SUCCESS;

        if (!success) {
          this.logger.warn(
            `[CHECK-CAR-WASH-STARTED] Child job car-wash-launch failed or returned non-success result: ${JSON.stringify(childResult)}`,
          );
        } else {
          this.logger.log(
            `[CHECK-CAR-WASH-STARTED] Child job car-wash-launch succeeded`,
          );
        }
        
        return success;
      } else {
        this.logger.warn(
          `[CHECK-CAR-WASH-STARTED] No child results found - car-wash-launch may have failed or not completed`,
        );
        return false;
      }
    } catch (error: any) {
      this.logger.error(
        `[CHECK-CAR-WASH-STARTED] ERROR - Failed to get child results: ${error.message} | Stack: ${error.stack}`,
      );
      return false;
    }
  }

  private async executeCheckCarWashStarted(
    orderId: number,
    carWashId: number,
    carWashDeviceId: number,
    bayType: any,
    job: Job<CheckCarWashStartedJobData>,
  ): Promise<string> {
    try {
      this.logger.log(
        `[CHECK-CAR-WASH-STARTED] Executing checkCarWashStartedUseCase for order#${orderId}`,
      );
      
      await this.checkCarWashStartedUseCase.execute(
        orderId,
        carWashId,
        carWashDeviceId,
        bayType,
      );
      
      JobValidationUtil.logJobSuccess(
        job.id,
        orderId,
        new Date().toISOString(),
        this.logger,
        'CHECK-CAR-WASH-STARTED',
      );
      
      const result = JobResult.SUCCESS;
      this.logger.log(
        `[CHECK-CAR-WASH-STARTED] Returning result: ${result} for parent job ${job.parent?.id || 'none'}`,
      );
      
      return result;
    } catch (error: any) {
      JobValidationUtil.logJobError(
        error,
        job.id,
        orderId,
        job.attemptsMade,
        this.logger,
        'CHECK-CAR-WASH-STARTED',
      );
      throw error;
    }
  }
}
