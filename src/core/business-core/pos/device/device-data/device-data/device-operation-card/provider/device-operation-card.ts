import { Provider } from '@nestjs/common';
import { DeviceOperationCardRepository } from '@pos/device/device-data/device-data/device-operation-card/repository/device-operation-card';
import { IDeviceOperationCardRepository } from '@pos/device/device-data/device-data/device-operation-card/interface/device-operation-card';

export const DeviceOperationCardRepositoryProvider: Provider = {
  provide: IDeviceOperationCardRepository,
  useClass: DeviceOperationCardRepository,
};
