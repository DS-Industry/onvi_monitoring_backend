import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';

export abstract class IDeviceProgramTypeRepository {
  abstract create(input: DeviceProgramType): Promise<DeviceProgramType>;
  abstract findOneById(id: number): Promise<DeviceProgramType>;
  abstract findOneByName(name: string): Promise<DeviceProgramType>;
  abstract findAllByCarWashDeviceTypeId(
    carWashDeviceTypeId: number,
  ): Promise<DeviceProgramType[]>;
  abstract findAll(): Promise<DeviceProgramType[]>;
}
