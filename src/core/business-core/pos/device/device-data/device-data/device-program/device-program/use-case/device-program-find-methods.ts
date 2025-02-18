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
    skip?: number,
    take?: number,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByDeviceIdAndDate(
      deviceId,
      dateStart,
      dateEnd,
      skip,
      take,
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
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
    );
  }
  async getAllByPosIdAndProgramCodeAndDate(
    posId: number,
    code: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByPosIdAndProgramCodeAndDate(
      posId,
      code,
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

  async getCountAllByDeviceIdAndDateProgram(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return await this.deviceProgramRepository.countAllByDeviceIdAndDateProgram(
      deviceId,
      dateStart,
      dateEnd,
    );
  }

  async getAllByPosIdAndPaidTypeAndDate(
    carWashPosId: number,
    isPaid: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByPosIdAndPaidTypeAndDate(
      carWashPosId,
      isPaid,
      dateStart,
      dateEnd,
    );
  }
}
