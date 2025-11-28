import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CarWashLaunchUseCase } from '@loyalty/mobile-user/order/use-cases/car-wash-launch.use-case';
import { Injectable, Logger } from '@nestjs/common';

@Processor('car-wash-launch')
@Injectable()
export class CarWashLaunchConsumer extends WorkerHost {
  private readonly logger = new Logger(CarWashLaunchConsumer.name);

  constructor(private readonly carWashLaunchUseCase: CarWashLaunchUseCase) {
    super();
    this.logger.log('[CAR-WASH-LAUNCH] Consumer initialized');
  }

  async process(job: Job<any>): Promise<string> {
    const startTime = new Date().toISOString();
    const parentId = job.parent?.id;
    this.logger.log(
      `[CAR-WASH-LAUNCH] [${startTime}] START - Job ${job.id} for order#${job.data.orderId}. Parent: ${parentId || 'none'}`,
    );
    
    await this.carWashLaunchUseCase.execute(
      job.data.orderId,
      job.data.carWashId,
      job.data.carWashDeviceId,
      job.data.bayType,
    );

    const endTime = new Date().toISOString();
    this.logger.log(
      `[CAR-WASH-LAUNCH] [${endTime}] END - Job ${job.id} completed successfully for order#${job.data.orderId}`,
    );
    return 'success';
  }
}
