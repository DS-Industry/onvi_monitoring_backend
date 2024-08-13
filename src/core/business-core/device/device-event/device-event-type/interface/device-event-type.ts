import { DeviceEventType } from '@device/device-event/device-event-type/domain/device-event-type';

export abstract class IDeviceEventTypeRepository {
  abstract create(input: DeviceEventType): Promise<DeviceEventType>;
  abstract findOneById(id: number): Promise<DeviceEventType>;
  abstract findOneByName(name: string): Promise<DeviceEventType>;
}
