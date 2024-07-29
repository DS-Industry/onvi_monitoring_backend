import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { HandlerDeviceDataRawCron } from './cron/handler-device-data-raw';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceDataRawConsumer } from './consumer/device-data-raw.consumer';

@Module({
  imports: [BusinessCoreModule, ScheduleModule],
  providers: [HandlerDeviceDataRawCron, DeviceDataRawConsumer],
  exports: [],
})
export class HandlerDeviceDataRawModule {}
