import { DeviceMfy } from '@device/device-mfu/domain/device-mfu';

export abstract class IDeviceMfuRepository {
  abstract create(input: DeviceMfy): Promise<DeviceMfy>;
  abstract findOneById(id: number): Promise<DeviceMfy>;
}
