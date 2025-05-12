import { Provider } from '@nestjs/common';
import { IDeviceEventTypeRepository } from '@pos/device/device-data/device-data/device-event/device-event-type/interface/device-event-type';
import { DeviceEventTypeRepository } from '@pos/device/device-data/device-data/device-event/device-event-type/repository/device-event-type';

export const DeviceEventTypeRepositoryProvider: Provider = {
  provide: IDeviceEventTypeRepository,
  useClass: DeviceEventTypeRepository,
};
