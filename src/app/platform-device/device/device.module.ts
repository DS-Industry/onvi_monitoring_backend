import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { CarWashDeviceController } from '@platform-device/device/controller/car-wash-device';
import { DeviceValidateRules } from '@platform-device/device/controller/validate/device-validate-rules';

@Module({
  imports: [BusinessCoreModule],
  controllers: [CarWashDeviceController],
  providers: [DeviceValidateRules],
})
export class DeviceModule {}
