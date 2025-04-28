import { Provider } from '@nestjs/common';
import { DeviceMfuRepository } from '@pos/device/device-data/device-data/device-mfu/repository/device-mfu';
import { IDeviceMfuRepository } from '@pos/device/device-data/device-data/device-mfu/interface/device-mfu';

export const DeviceMfuRepositoryProvider: Provider = {
  provide: IDeviceMfuRepository,
  useClass: DeviceMfuRepository,
};
