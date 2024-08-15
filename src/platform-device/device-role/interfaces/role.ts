import { DeviceRole } from '../domain/device-role';

export abstract class IDeviceRoleRepository {
  abstract findOneById(id: number): Promise<DeviceRole>;
  abstract findAllPermissionsByRoleId(roleId: number): Promise<DeviceRole>;
}
