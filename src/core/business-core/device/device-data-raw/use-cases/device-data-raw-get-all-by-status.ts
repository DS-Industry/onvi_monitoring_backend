import { Injectable } from '@nestjs/common';
import { DeviceDataRaw } from '@device/device-data-raw/domain/device-data-raw';
import { StatusDeviceDataRaw } from '@prisma/client';
import { IDeviceDataRawRepository } from '@device/device-data-raw/interface/device-data-raw';

@Injectable()
export class GetAllByStatusDeviceDataRawUseCase {
  constructor(
    private readonly deviceDataRawRepository: IDeviceDataRawRepository,
  ) {}

  async execute(status: StatusDeviceDataRaw): Promise<DeviceDataRaw[]> {
    return await this.deviceDataRawRepository.findAllByStatus(status);
  }
}
