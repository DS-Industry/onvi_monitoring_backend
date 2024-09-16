import { Module } from '@nestjs/common';
import { PlatformDeviceDataRawModule } from '@platform-device/device-data-raw/platform-device-post-data.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceAuthModule } from '@platform-device/auth/device-auth.module';
import { DeviceObjectModule } from '@platform-device/device-objects/device-objects.module';
import { DevicePermissionsModule } from '@platform-device/device-permissions/device-permission-module';
import { DeviceRoleModule } from '@platform-device/device-role/device-role-module';
import { DeviceModule } from '@platform-device/device/device.module';

@Module({
  imports: [
    BusinessCoreModule,
    PlatformDeviceDataRawModule,
    DeviceAuthModule,
    DeviceObjectModule,
    DevicePermissionsModule,
    DeviceRoleModule,
    DeviceModule,
  ],
  exports: [],
})
export class PlatformDeviceModule {}
