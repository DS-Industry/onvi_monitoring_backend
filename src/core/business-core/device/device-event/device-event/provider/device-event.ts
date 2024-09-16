import { Provider } from '@nestjs/common';
import { IDeviceEventRepository } from '@device/device-event/device-event/interface/device-event';
import { DeviceEventRepository } from '@device/device-event/device-event/repository/device-event';

export const DeviceEventRepositoryProvider: Provider = {
  provide: IDeviceEventRepository,
  useClass: DeviceEventRepository,
};
