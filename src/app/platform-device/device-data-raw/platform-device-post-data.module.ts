import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceDataRawController } from './controller/device-data-raw';

@Module({
  imports: [BusinessCoreModule],
  controllers: [DeviceDataRawController],
  providers: [],
})
export class PlatformDeviceDataRawModule {}
