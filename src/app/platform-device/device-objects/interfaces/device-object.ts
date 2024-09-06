import { DeviceObject } from '../domain/device-object';

export abstract class IDeviceObjectRepository {
  abstract findById(id: number): Promise<DeviceObject | null>;
}
