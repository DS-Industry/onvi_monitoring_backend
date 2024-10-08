import { Provider } from '@nestjs/common';
import { IDeviceServiceRepository } from '@pos/device/device-data/device-data/device-service/interface/device-service';
import { DeviceServiceRepository } from '@pos/device/device-data/device-data/device-service/repository/device-service';

export const DeviceServiceRepositoryProvider: Provider = {
  provide: IDeviceServiceRepository,
  useClass: DeviceServiceRepository,
};
