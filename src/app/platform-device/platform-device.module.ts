import { Module } from '@nestjs/common';
import { PlatformDeviceDataRawModule } from '@platform-device/device-data-raw/platform-device-post-data.module';
import { BusinessCoreModule } from '@business-core/business-core.module';

@Module({
  imports: [BusinessCoreModule, PlatformDeviceDataRawModule],
  exports: [],
})
export class PlatformDeviceModule {}
