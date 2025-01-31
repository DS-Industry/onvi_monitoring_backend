import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';

@Injectable()
export class FindMethodsDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async getAllByDeviceIdAndDateProgram(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByDeviceIdAndDate(
      deviceId,
      dateStart,
      dateEnd,
    );
  }
  async getAllByOrgIdAndDateProgram(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByDeviceIdAndDate(
      organizationId,
      dateStart,
      dateEnd,
    );
  }
  async getAllByPosIdAndDateProgram(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByPosIdAndDate(
      organizationId,
      dateStart,
      dateEnd,
    );
  }
  async getLastByDeviceId(deviceId: number): Promise<DeviceProgram> {
    return await this.deviceProgramRepository.findLastProgramByDeviceId(
      deviceId,
    );
  }
  async getLastByPosId(posId: number): Promise<DeviceProgram> {
    return await this.deviceProgramRepository.findLastProgramByPosId(posId);
  }
}
