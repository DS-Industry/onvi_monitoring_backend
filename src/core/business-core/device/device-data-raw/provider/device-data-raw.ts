import { Provider } from '@nestjs/common';
import { IDeviceDataRawRepository } from '@device/device-data-raw/interface/device-data-raw';
import { DeviceDataRawRepository } from '@device/device-data-raw/repository/device-data-raw';

export const DeviceDataRawRepositoryProvider: Provider = {
  provide: IDeviceDataRawRepository,
  useClass: DeviceDataRawRepository,
};
