import { Injectable } from '@nestjs/common';
import { DeviceDataRaw } from '@pos/device/device-data/device-data-raw/domain/device-data-raw';
import { StatusDeviceDataRaw } from '@prisma/client';
import { IDeviceDataRawRepository } from '@pos/device/device-data/device-data-raw/interface/device-data-raw';

@Injectable()
export class CreateDeviceDataRawUseCase {
  constructor(
    private readonly deviceDataRawRepository: IDeviceDataRawRepository,
  ) {}

  async execute(data: string): Promise<void> {
    const postDataData = new DeviceDataRaw({
      data: data,
      status: StatusDeviceDataRaw.NEW,
      version: 'OVEN',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    await this.deviceDataRawRepository.create(postDataData);
  }
}
