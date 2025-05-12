import { Provider } from '@nestjs/common';
import { IDeviceDataRawRepository } from '@pos/device/device-data/device-data-raw/interface/device-data-raw';
import { DeviceDataRawRepository } from '@pos/device/device-data/device-data-raw/repository/device-data-raw';

export const DeviceDataRawRepositoryProvider: Provider = {
  provide: IDeviceDataRawRepository,
  useClass: DeviceDataRawRepository,
};
