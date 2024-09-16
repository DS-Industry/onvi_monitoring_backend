import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceModule } from '@device/device/device.module';
import { DeviceMfuRepositoryProvider } from '@device/device-mfu/provider/device-mfu';
import { CreateDeviceMfuUseCase } from '@device/device-mfu/use-case/device-mfu-create';
import { DeviceMfuHandlerUseCase } from '@device/device-mfu/use-case/device-mfu-handler';

@Module({
  imports: [PrismaModule, DeviceModule],
  providers: [
    DeviceMfuRepositoryProvider,
    CreateDeviceMfuUseCase,
    DeviceMfuHandlerUseCase,
  ],
  exports: [DeviceMfuHandlerUseCase],
})
export class DeviceMfuModule {}
