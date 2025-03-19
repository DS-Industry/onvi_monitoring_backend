import { Injectable } from '@nestjs/common';
import { IDeviceProgramChangeRepository } from '@pos/device/device-data/device-data/device-program/device-program-change/interface/device-program-change';
import { DeviceProgramChange } from '@pos/device/device-data/device-data/device-program/device-program-change/domain/device-program-change';

@Injectable()
export class FindMethodsDeviceProgramChangeUseCase {
  constructor(
    private readonly deviceProgramChangeRepository: IDeviceProgramChangeRepository,
  ) {}

  async getById(input: number): Promise<DeviceProgramChange> {
    return await this.deviceProgramChangeRepository.findOneById(input);
  }

  async getOneByDeviceIdAndFromId(
    deviceId: number,
    fromId: number,
  ): Promise<DeviceProgramChange> {
    return await this.deviceProgramChangeRepository.findOneByDeviceIdAndFromId(
      deviceId,
      fromId,
    );
  }
}
