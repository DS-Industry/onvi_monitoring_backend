import { Provider } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPosRepository } from '@pos/carWashPos/repository/carWashPos';

export const CarWashPosProvider: Provider = {
  provide: ICarWashPosRepository,
  useClass: CarWashPosRepository,
};
