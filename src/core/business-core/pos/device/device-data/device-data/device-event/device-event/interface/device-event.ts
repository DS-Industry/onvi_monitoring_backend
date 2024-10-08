import { DeviceEvent } from '@pos/device/device-data/device-data/device-event/device-event/domain/device-event';

export abstract class IDeviceEventRepository {
  abstract create(input: DeviceEvent): Promise<DeviceEvent>;
  abstract findOneById(id: number): Promise<DeviceEvent>;
}
