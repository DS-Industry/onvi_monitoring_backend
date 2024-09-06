import { Provider } from '@nestjs/common';
import { IDeviceServiceRepository } from '@device/device-service/interface/device-service';
import { DeviceServiceRepository } from '@device/device-service/repository/device-service';

export const DeviceServiceRepositoryProvider: Provider = {
  provide: IDeviceServiceRepository,
  useClass: DeviceServiceRepository,
};
