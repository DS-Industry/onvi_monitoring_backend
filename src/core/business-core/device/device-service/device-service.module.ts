import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceModule } from '@device/device/device.module';
import { DeviceServiceRepositoryProvider } from '@device/device-service/provider/device-service';
import { CreateDeviceServiceUseCase } from '@device/device-service/use-case/device-service-create';
import { DeviceServiceHandlerUseCase } from '@device/device-service/use-case/device-service-handler';
import { DeviceProgramTypeModule } from '@device/device-program/device-program-type/device-program-type.module';

@Module({
  imports: [PrismaModule, DeviceModule, DeviceProgramTypeModule],
  providers: [
    DeviceServiceRepositoryProvider,
    CreateDeviceServiceUseCase,
    DeviceServiceHandlerUseCase,
  ],
  exports: [DeviceServiceHandlerUseCase],
})
export class DeviceServiceModule {}
