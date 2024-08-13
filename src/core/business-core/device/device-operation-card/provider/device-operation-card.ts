import { Provider } from '@nestjs/common';
import { DeviceOperationCardRepository } from '@device/device-operation-card/repository/device-operation-card';
import { IDeviceOperationCardRepository } from '@device/device-operation-card/interface/device-operation-card';

export const DeviceOperationCardRepositoryProvider: Provider = {
  provide: IDeviceOperationCardRepository,
  useClass: DeviceOperationCardRepository,
};
