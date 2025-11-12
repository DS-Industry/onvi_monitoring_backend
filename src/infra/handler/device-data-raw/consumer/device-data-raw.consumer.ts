import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { HandlerDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-handler';

@Processor('deviceDataRaw')
@Injectable()
export class DeviceDataRawConsumer extends WorkerHost {
  constructor(
    private readonly handlerDeviceDataRaw: HandlerDeviceDataRawUseCase,
  ) {
    super();
  }
  async process(job: Job): Promise<any> {
    await this.handlerDeviceDataRaw.execute(job.data.props);
    return Promise.resolve(undefined);
  }
}
