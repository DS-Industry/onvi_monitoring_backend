import { DeviceOperationCard } from '@device/device-operation-card/domain/device-operation-card';

export abstract class IDeviceOperationCardRepository {
  abstract create(input: DeviceOperationCard): Promise<DeviceOperationCard>;
  abstract findOneById(id: number): Promise<DeviceOperationCard>;
  abstract findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperationCard[]>;
}
