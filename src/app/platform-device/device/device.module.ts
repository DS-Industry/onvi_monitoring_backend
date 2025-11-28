import { Module, Provider } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { CarWashDeviceController } from '@platform-device/device/controller/car-wash-device';
import { DeviceValidateRules } from '@platform-device/validate/validate-rules/device-validate-rules';
import { LoyaltyDeviceController } from '@platform-device/device/controller/loyalty';
import { ValidatePlatformDeviceLib } from '@platform-device/validate/validate-platform-device.lib';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
const validate: Provider[] = [ValidatePlatformDeviceLib, DeviceValidateRules];
const controllers = [CarWashDeviceController, LoyaltyDeviceController];
@Module({
  imports: [BusinessCoreModule, LoyaltyCoreModule],
  controllers: [...controllers],
  providers: [...validate],
})
export class DeviceModule {}
