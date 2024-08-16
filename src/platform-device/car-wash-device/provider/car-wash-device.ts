import { Provider } from '@nestjs/common';
import { ICarWashDeviceRepository } from '../interfaces/car-wash-device';
import { CarWashDeviceRepository } from '../repository/car-wash-device';

export const CarWashDeviceRepositoryProvider: Provider = {
  provide: ICarWashDeviceRepository,
  useClass: CarWashDeviceRepository,
};
