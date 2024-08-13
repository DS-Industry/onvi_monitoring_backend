import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceProgramRepositoryProvider } from '@device/device-program/device-program/provider/device-program';
import { DeviceProgramHandlerUseCase } from '@device/device-program/device-program/use-case/device-program-handler';
import { DeviceModule } from '@device/device/device.module';
import { CreateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-create';
import { DeviceProgramTypeModule } from '@device/device-program/device-program-type/device-program-type.module';

@Module({
  imports: [PrismaModule, DeviceModule, DeviceProgramTypeModule],
  providers: [
    DeviceProgramRepositoryProvider,
    DeviceProgramHandlerUseCase,
    CreateDeviceProgramUseCase,
  ],
  exports: [DeviceProgramHandlerUseCase],
})
export class DeviceProgramModule {}
