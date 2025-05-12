import { Provider } from '@nestjs/common';
import { IDeviceApiKeyRepository } from '@platform-device/auth/interfaces/api-key';
import { DeviceApiKeyRepository } from '@platform-device/auth/repository/api-key';

export const PlatformDeviceApiKeyRepositoryProvider: Provider = {
  provide: IDeviceApiKeyRepository,
  useClass: DeviceApiKeyRepository,
};
