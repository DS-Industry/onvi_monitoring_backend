import { CarWashDevice } from '@pos/device/device/domain/device';

export abstract class ICarWashDeviceRepository {
  abstract create(input: CarWashDevice): Promise<CarWashDevice>;
  abstract findOneById(id: number): Promise<CarWashDevice>;
  abstract findAllByCWId(carWashPosId: number): Promise<CarWashDevice[]>;
  abstract findOneByNameAndCWId(
    carWashPosId: number,
    name: string,
  ): Promise<CarWashDevice>;
  abstract update(input: CarWashDevice): Promise<CarWashDevice>;
}
