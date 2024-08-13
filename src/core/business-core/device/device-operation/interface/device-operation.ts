import { DeviceOperation } from '@device/device-operation/domain/device-operation';

export abstract class IDeviceOperationRepository {
  abstract create(input: DeviceOperation): Promise<DeviceOperation>;
  abstract findOneById(id: number): Promise<DeviceOperation>;
  abstract findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation[]>;
}
