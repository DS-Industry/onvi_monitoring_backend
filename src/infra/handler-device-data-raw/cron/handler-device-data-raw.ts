import { Injectable } from '@nestjs/common';
import { CronDeviceDataRawUseCase } from '@pos/device/device-data/device-data-raw/use-cases/device-data-raw-cron';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HandlerDeviceDataRawCron {
  constructor(
    private readonly cronDeviceDataRawUseCase: CronDeviceDataRawUseCase,
  ) {}
  @Cron('*/3 * * * * *')
  async execute(): Promise<void> {
    await this.cronDeviceDataRawUseCase.execute();
  }
}
