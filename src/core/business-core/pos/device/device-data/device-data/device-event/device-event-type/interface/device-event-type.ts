import { DeviceEventType } from '@pos/device/device-data/device-data/device-event/device-event-type/domain/device-event-type';

export abstract class IDeviceEventTypeRepository {
  abstract create(input: DeviceEventType): Promise<DeviceEventType>;
  abstract findOneById(id: number): Promise<DeviceEventType>;
  abstract findOneByName(name: string): Promise<DeviceEventType>;
}
