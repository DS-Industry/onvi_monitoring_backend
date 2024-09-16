import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';

@Injectable()
export class DeviceProgramGetLastProgByPosIdUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(posId: number): Promise<DeviceProgram> {
    return await this.deviceProgramRepository.findLastProgramByPosId(posId);
  }
}
