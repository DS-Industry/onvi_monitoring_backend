import { CarWashDevice } from '../domain/car-wash-device';

export abstract class ICarWashDeviceRepository {
  abstract create(input: CarWashDevice): Promise<CarWashDevice>;
  abstract update(id: number, input: CarWashDevice): Promise<CarWashDevice>;
  abstract findOneById(id: number): Promise<CarWashDevice>;
  abstract findAll(): Promise<CarWashDevice[]>;
}
