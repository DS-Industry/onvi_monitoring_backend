import { Provider } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@device/device/interfaces/device';
import { CarWashDeviceRepository } from '@device/device/repository/device';

export const CarWashDeviceRepositoryProvider: Provider = {
  provide: ICarWashDeviceRepository,
  useClass: CarWashDeviceRepository,
};
