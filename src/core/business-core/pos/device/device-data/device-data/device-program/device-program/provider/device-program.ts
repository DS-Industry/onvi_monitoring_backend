import { Provider } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { DeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/repository/device-program';

export const DeviceProgramRepositoryProvider: Provider = {
  provide: IDeviceProgramRepository,
  useClass: DeviceProgramRepository,
};
