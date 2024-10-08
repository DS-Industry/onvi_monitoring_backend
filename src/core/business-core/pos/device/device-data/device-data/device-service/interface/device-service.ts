import { DeviceService } from "@pos/device/device-data/device-data/device-service/domain/device-service";

export abstract class IDeviceServiceRepository {
  abstract create(input: DeviceService): Promise<DeviceService>;
  abstract findOneById(id: number): Promise<DeviceService>;
}