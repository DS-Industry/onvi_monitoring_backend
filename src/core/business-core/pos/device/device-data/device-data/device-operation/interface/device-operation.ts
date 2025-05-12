import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { CurrencyType } from '@prisma/client';

export abstract class IDeviceOperationRepository {
  abstract create(input: DeviceOperation): Promise<DeviceOperation>;
  abstract findOneById(id: number): Promise<DeviceOperation>;
  abstract findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation[]>;
  abstract findAllByCurTypeAndDate(
    currencyType: CurrencyType,
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]>;
  abstract findAllByOrgIdAndDate(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]>;
  abstract findAllByPosIdAndDate(
    carWashPosId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]>;
  abstract findAllByDeviceIdAndDate(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperation[]>;
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
