import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CarWashLaunchUseCase } from '@loyalty/mobile-user/order/use-cases/car-wash-launch.use-case';
import { Injectable } from '@nestjs/common';

@Processor('car-wash-launch')
@Injectable()
export class CarWashLaunchConsumer extends WorkerHost {
  constructor(
    private readonly carWashLaunchUseCase: CarWashLaunchUseCase,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<string> {
    await this.carWashLaunchUseCase.execute(
      job.data.orderId,
      job.data.carWashId,
      job.data.carWashDeviceId,
      job.data.bayType,
    );
    return 'success';
  }
}

