import { DeviceOperationCard } from '@pos/device/device-data/device-data/device-operation-card/domain/device-operation-card';

export abstract class IDeviceOperationCardRepository {
  abstract create(input: DeviceOperationCard): Promise<DeviceOperationCard>;
  abstract findOneById(id: number): Promise<DeviceOperationCard>;
  abstract findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperationCard[]>;
  abstract findAllByDeviceIdAndDate(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperationCard[]>;
}
