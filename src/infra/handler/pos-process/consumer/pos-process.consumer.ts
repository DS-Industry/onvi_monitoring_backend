import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { StartPosUseCase } from '@loyalty/mobile-user/order/use-cases/start-pos.use-case';
import { Injectable } from '@nestjs/common';

@Processor('pos-process')
@Injectable()
export class StartPosProcess extends WorkerHost {
  constructor(private readonly startPosUseCase: StartPosUseCase) {
    super();
  }

  async process(job: Job<any>): Promise<string> {
    console.log('pos-process starteed');
    await this.startPosUseCase.execute(
      job.data.orderId,
      job.data.carWashId,
      job.data.carWashDeviceId,
      job.data.bayType,
    );
    return 'success';
  }
}
