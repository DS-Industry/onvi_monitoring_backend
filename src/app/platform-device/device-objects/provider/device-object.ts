import { Provider } from '@nestjs/common';
import { IDeviceObjectRepository } from '../interfaces/device-object';
import { DeviceObjectRepository } from '../repository/device-object';

export const DeviceObjectRepositoryProvider: Provider = {
  provide: IDeviceObjectRepository,
  useClass: DeviceObjectRepository,
};
