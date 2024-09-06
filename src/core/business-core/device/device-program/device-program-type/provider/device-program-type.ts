import { Provider } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@device/device-program/device-program-type/interface/device-program-type';
import { DeviceProgramTypeRepository } from '@device/device-program/device-program-type/repository/device-program-type';

export const DeviceProgramTypeRepositoryProvider: Provider = {
  provide: IDeviceProgramTypeRepository,
  useClass: DeviceProgramTypeRepository,
};
