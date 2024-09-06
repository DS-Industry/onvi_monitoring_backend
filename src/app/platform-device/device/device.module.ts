import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { CarWashDeviceController } from '@platform-device/device/controller/car-wash-device';

@Module({
  imports: [BusinessCoreModule],
  controllers: [CarWashDeviceController],
  providers: [],
})
export class DeviceModule {}
