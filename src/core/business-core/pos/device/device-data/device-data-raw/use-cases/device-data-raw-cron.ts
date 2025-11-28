import { Injectable } from '@nestjs/common';
import { IDeviceDataRawRepository } from '@pos/device/device-data/device-data-raw/interface/device-data-raw';
import { StatusDeviceDataRaw } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CronDeviceDataRawUseCase {
  constructor(
    private readonly deviceDataRawRepository: IDeviceDataRawRepository,
    @InjectQueue('deviceDataRaw') private readonly dataQueue: Queue,
  ) {}

  async execute(): Promise<void> {
    const BATCH_SIZE = 25;
    const deviceDataRaws =
      await this.deviceDataRawRepository.findAndLockByStatus(
        StatusDeviceDataRaw.NEW,
        BATCH_SIZE,
      );

    for (const deviceDataRaw of deviceDataRaws) {
      await this.dataQueue.add('deviceDataRaw', deviceDataRaw, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  }
}
