import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceModule } from '@device/device/device.module';
import { DeviceOperationCardRepositoryProvider } from '@device/device-operation-card/provider/device-operation-card';
import { CreateDeviceOperationCardUseCase } from '@device/device-operation-card/use-cases/device-operation-card-create';
import { DeviceOperationCardHandlerUseCase } from '@device/device-operation-card/use-cases/device-operation-card-handler';

@Module({
  imports: [PrismaModule, DeviceModule],
  providers: [
    DeviceOperationCardRepositoryProvider,
    CreateDeviceOperationCardUseCase,
    DeviceOperationCardHandlerUseCase,
  ],
  exports: [DeviceOperationCardHandlerUseCase],
})
export class DeviceOperationCardModule {}
