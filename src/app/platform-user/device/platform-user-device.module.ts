import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceController } from '@platform-user/device/controller/device';
import { PreCreateDeviceUseCase } from '@platform-user/device/use-case/device-pre-create';

@Module({
  imports: [BusinessCoreModule],
  controllers: [DeviceController],
  providers: [PreCreateDeviceUseCase],
})
export class PlatformUserDeviceModule {}
