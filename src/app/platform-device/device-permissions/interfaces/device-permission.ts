import { DevicePermission } from '../domain/device-permission';

export abstract class IDevicePermissionsRepository {
  abstract create(
    input: DevicePermission,
    roles: { id: number }[],
  ): Promise<DevicePermission>;
  abstract update(
    id: number,
    input: DevicePermission,
  ): Promise<DevicePermission>;
  abstract findAll(): Promise<DevicePermission[]>;
  abstract findOneById(id: number): Promise<DevicePermission>;
}
