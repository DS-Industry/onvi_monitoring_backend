import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { CurrencyType } from '@prisma/client';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';
import { DeviceOperationLastDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-last-data-response.dto';
import { DeviceOperationFullSumDyPosResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-sum-dy-pos-response.dto';
import { DeviceOperationDailyStatisticResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-daily-statistic-response.dto';
import { FalseOperationResponseDto } from '@platform-user/core-controller/dto/response/false-operation-response.dto';

export abstract class IDeviceOperationRepository {
  abstract create(input: DeviceOperation): Promise<DeviceOperation>;
  abstract findOneById(id: number): Promise<DeviceOperation>;
  abstract findAllByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    currencyId?: number,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationFullDataResponseDto[]>;
  abstract findCountByFilter(
    ability?: any,
    organizationId?: number,
    posIds?: number[],
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    currencyId?: number,
  ): Promise<number>;
  abstract findDataByMonitoring(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]>;
  abstract findDataByMonitoringDetail(
    deviceIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationMonitoringResponseDto[]>;
  abstract findAllSumByPos(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationFullSumDyPosResponseDto[]>;
  abstract findDailyStatistics(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperationDailyStatisticResponseDto[]>;
  abstract findDataLastOperByPosIds(
    posIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]>;
  abstract findDataLastOperByDeviceIds(
    deviceIds: number[],
  ): Promise<DeviceOperationLastDataResponseDto[]>;
  abstract findFalseOperationsByPosId(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<FalseOperationResponseDto[]>;
  abstract delete(id: number): Promise<void>;
}
