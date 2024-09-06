import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';

@Injectable()
export class DeviceProgramGetLastProgByDeviceIdUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(deviceId: number): Promise<DeviceProgram> {
    return await this.deviceProgramRepository.findLastProgramByDeviceId(
      deviceId,
    );
  }
}
