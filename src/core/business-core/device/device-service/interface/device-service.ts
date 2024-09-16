import { DeviceService } from "@device/device-service/domain/device-service";

export abstract class IDeviceServiceRepository {
  abstract create(input: DeviceService): Promise<DeviceService>;
  abstract findOneById(id: number): Promise<DeviceService>;
}