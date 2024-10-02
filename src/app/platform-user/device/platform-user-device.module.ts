import { Module } from '@nestjs/common';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { DeviceController } from '@platform-user/device/controller/device';
import { FilterDeviceByUserUseCase } from '@platform-user/device/use-case/devica-filter-by-user';
import { MonitoringDeviceUseCase } from '@platform-user/device/use-case/device-monitoring';
import { ProgramDeviceUseCase } from '@platform-user/device/use-case/device-program';
import { DeviceValidateRules } from "@platform-user/device/controller/validate/device-validate-rules";

@Module({
  imports: [BusinessCoreModule],
  controllers: [DeviceController],
  providers: [
    FilterDeviceByUserUseCase,
    MonitoringDeviceUseCase,
    ProgramDeviceUseCase,
    DeviceValidateRules,
  ],
})
export class PlatformUserDeviceModule {}
