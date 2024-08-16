import { Provider } from '@nestjs/common';
import { IDeviceRoleRepository } from '../interfaces/role';
import { DeviceRoleRepository } from '../repository/device-role';

export const DeviceRoleRepositoryProvider: Provider = {
  provide: IDeviceRoleRepository,
  useClass: DeviceRoleRepository,
};
