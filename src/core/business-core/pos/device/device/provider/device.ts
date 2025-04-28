import { Provider } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@pos/device/device/interfaces/device';
import { CarWashDeviceRepository } from '@pos/device/device/repository/device';

export const CarWashDeviceRepositoryProvider: Provider = {
  provide: ICarWashDeviceRepository,
  useClass: CarWashDeviceRepository,
};
