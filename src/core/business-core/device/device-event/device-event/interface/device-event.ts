import { DeviceEvent } from '@device/device-event/device-event/domain/device-event';

export abstract class IDeviceEventRepository {
  abstract create(input: DeviceEvent): Promise<DeviceEvent>;
  abstract findOneById(id: number): Promise<DeviceEvent>;
}
