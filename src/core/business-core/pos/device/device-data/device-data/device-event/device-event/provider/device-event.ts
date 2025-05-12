import { Provider } from '@nestjs/common';
import { IDeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/interface/device-event';
import { DeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/repository/device-event';

export const DeviceEventRepositoryProvider: Provider = {
  provide: IDeviceEventRepository,
  useClass: DeviceEventRepository,
};
