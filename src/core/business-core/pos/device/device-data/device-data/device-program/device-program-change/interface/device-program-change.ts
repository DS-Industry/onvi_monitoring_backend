import { DeviceProgramChange } from '@pos/device/device-data/device-data/device-program/device-program-change/domain/device-program-change';

export abstract class IDeviceProgramChangeRepository {
  abstract create(input: DeviceProgramChange): Promise<DeviceProgramChange>;
  abstract findOneById(id: number): Promise<DeviceProgramChange>;
  abstract findOneByDeviceIdAndFromId(
    deviceId: number,
    fromId: number,
  ): Promise<DeviceProgramChange>;
  abstract update(input: DeviceProgramChange): Promise<DeviceProgramChange>;
}
