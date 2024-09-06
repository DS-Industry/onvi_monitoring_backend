import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceDataRawController } from './controller/device-data-raw';
import { ValidateApiKeyStrategyUseCase } from '@platform-device/device-data-raw/use-case/auth-validate-api-key-strategy';
import { DeviceAuthModule } from '@platform-device/auth/device-auth.module';
import { ApiKeyStrategy } from '@platform-device/device-data-raw/strategies/api-key.strategies';

@Module({
  imports: [BusinessCoreModule, DeviceAuthModule],
  controllers: [DeviceDataRawController],
  providers: [ValidateApiKeyStrategyUseCase, ApiKeyStrategy],
})
export class PlatformDeviceDataRawModule {}
