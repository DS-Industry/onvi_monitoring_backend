import { Provider } from '@nestjs/common';
import { DeviceMfuRepository } from '@device/device-mfu/repository/device-mfu';
import { IDeviceMfuRepository } from '@device/device-mfu/interface/device-mfu';

export const DeviceMfuRepositoryProvider: Provider = {
  provide: IDeviceMfuRepository,
  useClass: DeviceMfuRepository,
};
