import { Injectable } from '@nestjs/common';
import { IDeviceDataRawRepository } from '@device/device-data-raw/interface/device-data-raw';
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
    const deviceDataRaws = await this.deviceDataRawRepository.findAllByStatus(
      StatusDeviceDataRaw.NEW,
    );
    for (const deviceDataRaw of deviceDataRaws) {
      deviceDataRaw.status = StatusDeviceDataRaw.PENDING;
      deviceDataRaw.updatedAt = new Date(Date.now());
      const newDeviceDataRaw =
        await this.deviceDataRawRepository.update(deviceDataRaw);
      await this.dataQueue.add('deviceDataRaw', newDeviceDataRaw, {
        removeOnComplete: true,
        removeOnFail: false,
      });
    }
  }
}
