import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

export abstract class ICarWashPosRepository {
  abstract create(input: CarWashPos): Promise<CarWashPos>;
  abstract findOneById(id: number): Promise<CarWashPos>;
  abstract findOneByPosId(posId: number): Promise<CarWashPos>;
  abstract update(input: CarWashPos): Promise<CarWashPos>;
}
