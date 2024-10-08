import { Provider } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@pos/device/device-data/device-data/device-program/device-program-type/interface/device-program-type';
import { DeviceProgramTypeRepository } from '@pos/device/device-data/device-data/device-program/device-program-type/repository/device-program-type';

export const DeviceProgramTypeRepositoryProvider: Provider = {
  provide: IDeviceProgramTypeRepository,
  useClass: DeviceProgramTypeRepository,
};
