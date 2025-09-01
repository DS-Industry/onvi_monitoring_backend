import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { CurrencyType } from '@prisma/client';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';
import { DeviceOperationLastDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-last-data-response.dto';
import { DeviceOperationFullSumDyPosResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-sum-dy-pos-response.dto';
import { DeviceOperationDailyStatisticResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-daily-statistic-response.dto';

@Injectable()
export class FindMethodsDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}
  async getAllByFilter(data: {
    ability?: any;
    organizationId?: number;
    posIds?: number[];
    carWashDeviceId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    currencyType?: CurrencyType;
    currencyId?: number;
    skip?: number;
    take?: number;
  }): Promise<DeviceOperationFullDataResponseDto[]> {
    return await this.deviceOperationRepository.findAllByFilter(
      data.ability,
      data.organizationId,
      data.posIds,
      data.carWashDeviceId,
      data.dateStart,
      data.dateEnd,
      data.currencyType,
      data.currencyId,
      data.skip,
      data.take,
    );
  }

  async getCountByFilter(data: {
    ability?: any;
    organizationId?: number;
    posIds?: number[];
    carWashDeviceId?: number;
    dateStart?: Date;
    dateEnd?: Date;
    currencyType?: CurrencyType;
    currencyId?: number;
  }): Promise<number> {
    return await this.deviceOperationRepository.findCountByFilter(
      data.ability,
      data.organizationId,
      data.posIds,
      data.carWashDeviceId,
      data.dateStart,
      data.dateEnd,
      data.currencyType,
      data.currencyId,
    );
  }

  async getDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    return await this.deviceOperationRepository.findDataByMonitoring(
      posIds,
      dateStart,
      dateEnd,
    );
  }

  async getAllSumByPos(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationFullSumDyPosResponseDto[]> {
    return await this.deviceOperationRepository.findAllSumByPos(
      posIds,
      dateStart,
      dateEnd,
    );
  }

  async getDailyStatistics(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationDailyStatisticResponseDto[]> {
    return await this.deviceOperationRepository.findDailyStatistics(
      posIds,
      dateStart,
      dateEnd,
    );
  }

  async getDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]> {
    return await this.deviceOperationRepository.findDataByMonitoringDetail(
      deviceIds,
      dateStart,
      dateEnd,
    );
  }

  async getDataLastOperByPosIds(
    posIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]> {
    return await this.deviceOperationRepository.findDataLastOperByPosIds(
      posIds,
    );
  }

  async getDataLastOperByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]> {
    return await this.deviceOperationRepository.findDataLastOperByDeviceIds(
      deviceIds,
    );
  }
}
