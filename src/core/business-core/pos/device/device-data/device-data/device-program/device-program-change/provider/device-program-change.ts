import { Provider } from '@nestjs/common';
import { IDeviceProgramChangeRepository } from '@pos/device/device-data/device-data/device-program/device-program-change/interface/device-program-change';
import { DeviceProgramChangeRepository } from '@pos/device/device-data/device-data/device-program/device-program-change/repository/device-program-change';

export const DeviceProgramChangeRepositoryProvider: Provider = {
  provide: IDeviceProgramChangeRepository,
  useClass: DeviceProgramChangeRepository,
};
