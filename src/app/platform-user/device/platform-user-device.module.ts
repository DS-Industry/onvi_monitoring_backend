import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceController } from '@platform-user/device/controller/device';
import { PreCreateDeviceUseCase } from '@platform-user/device/use-case/device-pre-create';
import { FilterDeviceByUserUseCase } from '@platform-user/device/use-case/devica-filter-by-user';
import { MonitoringDeviceUseCase } from '@platform-user/device/use-case/device-monitoring';
import { ProgramDeviceUseCase } from '@platform-user/device/use-case/device-program';

@Module({
  imports: [BusinessCoreModule],
  controllers: [DeviceController],
  providers: [
    PreCreateDeviceUseCase,
    FilterDeviceByUserUseCase,
    MonitoringDeviceUseCase,
    ProgramDeviceUseCase,
  ],
})
export class PlatformUserDeviceModule {}
