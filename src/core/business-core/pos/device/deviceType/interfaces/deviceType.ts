import { CarWashDeviceType } from '@pos/device/deviceType/domen/deviceType';

export abstract class ICarWashDeviceTypeRepository {
  abstract create(input: CarWashDeviceType): Promise<CarWashDeviceType>;
  abstract findOneById(id: number): Promise<CarWashDeviceType>;
  abstract findOneByName(name: string): Promise<CarWashDeviceType>;
  abstract findOneByCode(code: string): Promise<CarWashDeviceType>;
  abstract findAll(): Promise<CarWashDeviceType[]>;
  abstract update(input: CarWashDeviceType): Promise<CarWashDeviceType>;
}
