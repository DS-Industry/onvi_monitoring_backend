import { DeviceMfy } from '@pos/device/device-data/device-data/device-mfu/domain/device-mfu';

export abstract class IDeviceMfuRepository {
  abstract create(input: DeviceMfy): Promise<DeviceMfy>;
  abstract findOneById(id: number): Promise<DeviceMfy>;
}
