import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';

export abstract class IDeviceProgramRepository {
  abstract create(input: DeviceProgram): Promise<DeviceProgram>;
  abstract findOneById(id: number): Promise<DeviceProgram>;
  abstract findAllByDeviceId(carWashDeviceId: number): Promise<DeviceProgram[]>;
}
