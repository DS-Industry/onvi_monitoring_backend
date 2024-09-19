import { Injectable } from '@nestjs/common';
import { DeviceDataRawCreateDto } from '@platform-device/device-data-raw/controller/dto/device-data-raw-create.dto';
import { DeviceDataRaw } from '@device/device-data-raw/domain/device-data-raw';
import { StatusDeviceDataRaw } from '@prisma/client';
import { IDeviceDataRawRepository } from '@device/device-data-raw/interface/device-data-raw';

@Injectable()
export class CreateDeviceDataRawUseCase {
  constructor(
    private readonly deviceDataRawRepository: IDeviceDataRawRepository,
  ) {}

  async execute(input: DeviceDataRawCreateDto): Promise<void> {
    const postDataData = new DeviceDataRaw({
      data: input.data,
      status: StatusDeviceDataRaw.NEW,
      version: 'OVEN',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    await this.deviceDataRawRepository.create(postDataData);
  }
}
