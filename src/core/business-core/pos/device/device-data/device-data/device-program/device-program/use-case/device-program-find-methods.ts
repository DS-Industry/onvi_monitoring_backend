import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  DeviceProgramFullDataResponseDto
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto";

@Injectable()
export class FindMethodsDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}
  async getAllByFilter(data: {
    ability?: any;
    organizationId?: number;
    posId?: number;
    carWashDeviceId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    programCode?: string;
    isPaid?: number;
    skip?: number;
    take?: number;
  }): Promise<DeviceProgramFullDataResponseDto[]> {
    return await this.deviceProgramRepository.findAllByFilter(
      data.ability,
      data.organizationId,
      data.posId,
      data.carWashDeviceId,
      data.dateStart,
      data.dateEnd,
      data.programCode,
      data.isPaid,
      data.skip,
      data.take,
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
}
