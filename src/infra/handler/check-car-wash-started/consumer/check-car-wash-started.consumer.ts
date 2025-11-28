import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckCarWashStartedUseCase } from '@loyalty/mobile-user/order/use-cases/check-car-wash-started.use-case';
import { Injectable, Logger } from '@nestjs/common';

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

  async process(job: Job<any>): Promise<string> {
    const startTime = new Date().toISOString();
    const parentId = job.parent?.id;
    this.logger.log(
      `[CHECK-CAR-WASH-STARTED] [${startTime}] START - Job ${job.id} for order#${job.data.orderId}. Parent: ${parentId || 'none'}`,
    );
    let carWashLaunchSuccess = false;
    try {
      const childrenResults = await job.getChildrenValues<any>();
      const childResultsArray = Object.values(childrenResults);

      if (childResultsArray.length > 0) {
        const childResult = childResultsArray[0];
        carWashLaunchSuccess = childResult === 'success';

        if (!carWashLaunchSuccess) {
          this.logger.warn(
            `[CHECK-CAR-WASH-STARTED] Child job car-wash-launch returned: ${childResult}`,
          );
        } else {
          this.logger.log(
            `[CHECK-CAR-WASH-STARTED] Child job car-wash-launch succeeded`,
          );
        }
      } else {
        this.logger.warn(`[CHECK-CAR-WASH-STARTED] No child results found`);
      }
    } catch (error: any) {
      this.logger.warn(
        `[CHECK-CAR-WASH-STARTED] Failed to get child results: ${error.message}`,
      );
    }

    if (carWashLaunchSuccess) {
      await this.checkCarWashStartedUseCase.execute(
        job.data.orderId,
        job.data.carWashId,
        job.data.carWashDeviceId,
        job.data.bayType,
      );
      const endTime = new Date().toISOString();
      this.logger.log(
        `[CHECK-CAR-WASH-STARTED] [${endTime}] END - Job ${job.id} completed successfully for order#${job.data.orderId}`,
      );
      return 'success';
    } else {
      const endTime = new Date().toISOString();
      this.logger.warn(
        `[CHECK-CAR-WASH-STARTED] [${endTime}] END - Job ${job.id} skipped - car-wash-launch did not succeed for order#${job.data.orderId}`,
      );
      return 'skipped';
    }
  }
}
