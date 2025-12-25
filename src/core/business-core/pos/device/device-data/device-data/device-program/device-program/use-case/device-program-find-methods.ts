import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { DeviceProgramFullDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
import { DeviceProgramLastDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-last-data-response.dto';
import { DeviceProgramCleanDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-clean-data-response.dto';

@Injectable()
export class FindMethodsDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}
  async getAllByFilter(data: {
    ability?: any;
    organizationId?: number;
    posIds?: number[];
    carWashDeviceId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    programCodes?: string[];
    isPaid?: number;
    skip?: number;
    take?: number;
  }): Promise<DeviceProgramFullDataResponseDto[]> {
    return await this.deviceProgramRepository.findAllByFilter(
      data.ability,
      data.organizationId,
      data.posIds,
      data.carWashDeviceId,
      data.dateStart,
      data.dateEnd,
      data.programCodes,
      data.isPaid,
      data.skip,
      data.take,
    );
  }
  async getDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    return await this.deviceProgramRepository.findDataByMonitoring(
      posIds,
      dateStart,
      dateEnd,
    );
  }
  async getDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    return await this.deviceProgramRepository.findDataByMonitoringDetail(
      deviceIds,
      dateStart,
      dateEnd,
    );
  }
  async getDataByMonitoringDetailPortal(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramMonitoringResponseDto[]> {
    return await this.deviceProgramRepository.findDataByMonitoringDetailPortal(
      deviceIds,
      dateStart,
      dateEnd,
    );
  }
  async getDataByClean(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramCleanDataResponseDto[]> {
    return await this.deviceProgramRepository.findDataByClean(
      posIds,
      dateStart,
      dateEnd,
    );
  }

  async getLastByPosIds(
    posIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]> {
    return await this.deviceProgramRepository.findDataLastProgByPosIds(posIds);
  }

  async getLastByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceProgramLastDataResponseDto[]> {
    return await this.deviceProgramRepository.findDataLastProgByDeviceIds(
      deviceIds,
    );
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
