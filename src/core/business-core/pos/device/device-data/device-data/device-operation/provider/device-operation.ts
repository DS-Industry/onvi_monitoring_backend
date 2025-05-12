import { Provider } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { DeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/repository/device-operation';

export const DeviceOperationRepositoryProvider: Provider = {
  provide: IDeviceOperationRepository,
  useClass: DeviceOperationRepository,
};
