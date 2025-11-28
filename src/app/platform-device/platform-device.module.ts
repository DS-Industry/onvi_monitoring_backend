import { Module } from '@nestjs/common';
import { PlatformDeviceDataRawModule } from '@platform-device/device-data-raw/platform-device-post-data.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceAuthModule } from '@platform-device/auth/device-auth.module';
import { DevicePermissionsModule } from '@platform-device/device-permissions/device-permission-module';
import { DeviceRoleModule } from '@platform-device/device-role/device-role-module';
import { DeviceModule } from '@platform-device/device/device.module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';

@Module({
  imports: [
    BusinessCoreModule,
    PlatformDeviceDataRawModule,
    DeviceAuthModule,
    DevicePermissionsModule,
    DeviceRoleModule,
    DeviceModule,
    LoyaltyCoreModule,
  ],
  exports: [],
})
export class PlatformDeviceModule {}
