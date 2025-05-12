import { Provider } from '@nestjs/common';
import { ICarWashDeviceTypeRepository } from '@pos/device/deviceType/interfaces/deviceType';
import { CarWashDeviceTypeRepository } from '@pos/device/deviceType/repository/deviceType';

export const CarWashDeviceTypeRepositoryProvider: Provider = {
  provide: ICarWashDeviceTypeRepository,
  useClass: CarWashDeviceTypeRepository,
};
