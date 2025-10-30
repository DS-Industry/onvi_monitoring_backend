import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { StartPosUseCase } from '@loyalty/mobile-user/order/use-cases/start-pos.use-case';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '@loyalty/order/repository/order';

@Processor('pos-process')
@Injectable()
export class StartPosProcess extends WorkerHost {
  constructor(
    private readonly startPosUseCase: StartPosUseCase,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<string> {
    await this.startPosUseCase.execute(
      job.data.orderId,
      job.data.carWashId,
      job.data.carWashDeviceId,
      job.data.bayType
    );
    return 'success';
  }
}
