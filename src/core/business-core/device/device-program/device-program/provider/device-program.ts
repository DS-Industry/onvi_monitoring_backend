import { Provider } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceProgramRepository } from '@device/device-program/device-program/repository/device-program';

export const DeviceProgramRepositoryProvider: Provider = {
  provide: IDeviceProgramRepository,
  useClass: DeviceProgramRepository,
};
