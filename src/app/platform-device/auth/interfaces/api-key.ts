import { DeviceApiKey } from '../domain/api-key';

export abstract class IDeviceApiKeyRepository {
  abstract create(input: DeviceApiKey): Promise<DeviceApiKey>;
  abstract findByKey(key: string): Promise<DeviceApiKey | null>;
}
