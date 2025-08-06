import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { CurrencyType } from '@prisma/client';
import {
  DeviceOperationFullDataResponseDto
} from "@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto";

export abstract class IDeviceOperationRepository {
  abstract create(input: DeviceOperation): Promise<DeviceOperation>;
  abstract findOneById(id: number): Promise<DeviceOperation>;
  abstract findAllByFilter(
    ability?: any,
    organizationId?: number,
    posId?: number,
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationFullDataResponseDto[]>;
  abstract findLastOperByPosId(byPosId: number): Promise<DeviceOperation>;
  abstract findLastOperByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation>;
  abstract countAllByDeviceIdAndDateOper(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number>;
}
