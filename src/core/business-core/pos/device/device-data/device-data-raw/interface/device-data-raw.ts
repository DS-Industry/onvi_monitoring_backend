import { DeviceDataRaw } from '@pos/device/device-data/device-data-raw/domain/device-data-raw';
import { StatusDeviceDataRaw } from '@prisma/client';

export abstract class IDeviceDataRawRepository {
  abstract create(input: DeviceDataRaw): Promise<DeviceDataRaw>;
  abstract findOneById(id: number): Promise<DeviceDataRaw>;
  abstract findAllByStatus(
    status: StatusDeviceDataRaw,
  ): Promise<DeviceDataRaw[]>;
  abstract update(input: DeviceDataRaw): Promise<DeviceDataRaw>;
}
