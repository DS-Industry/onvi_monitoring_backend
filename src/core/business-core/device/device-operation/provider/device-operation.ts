import { Provider } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationRepository } from '@device/device-operation/repository/device-operation';

export const DeviceOperationRepositoryProvider: Provider = {
  provide: IDeviceOperationRepository,
  useClass: DeviceOperationRepository,
};
