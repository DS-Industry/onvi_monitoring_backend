import { Provider } from '@nestjs/common';
import { IDevicePermissionsRepository } from '../interfaces/device-permission';
import { DevicePermissionsRepository } from '../repository/device-permission';

export const DevicePermissionsRepositoryProvider: Provider = {
  provide: IDevicePermissionsRepository,
  useClass: DevicePermissionsRepository,
};
