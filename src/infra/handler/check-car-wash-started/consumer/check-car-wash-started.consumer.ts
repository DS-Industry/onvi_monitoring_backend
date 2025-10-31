import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CheckCarWashStartedUseCase } from '@loyalty/mobile-user/order/use-cases/check-car-wash-started.use-case';
import { Injectable } from '@nestjs/common';

@Processor('check-car-wash-started')
@Injectable()
export class CheckCarWashStartedConsumer extends WorkerHost {
  constructor(
    private readonly checkCarWashStartedUseCase: CheckCarWashStartedUseCase,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<string> {
    await this.checkCarWashStartedUseCase.execute(
      job.data.orderId,
      job.data.carWashId,
      job.data.carWashDeviceId,
      job.data.bayType,
    );
    return 'success';
  }
}

