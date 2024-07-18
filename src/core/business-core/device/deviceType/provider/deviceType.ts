import { Provider } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@device/deviceType/interfaces/deviceType';
import { CarWashDeviceTypeRepository } from '@device/deviceType/repository/deviceType';

export const CarWashDeviceTypeRepositoryProvider: Provider = {
  provide: ICarWashDeviceTypeRepository,
  useClass: CarWashDeviceTypeRepository,
};
