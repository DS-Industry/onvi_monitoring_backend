import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceOperationCardRepositoryProvider } from '@device/device-operation-card/provider/device-operation-card';
import { CreateDeviceOperationCardUseCase } from '@device/device-operation-card/use-cases/device-operation-card-create';
import { DeviceOperationCardHandlerUseCase } from '@device/device-operation-card/use-cases/device-operation-card-handler';
import { PosModule } from "@pos/pos.module";

@Module({
  imports: [PrismaModule, PosModule],
  providers: [
    DeviceOperationCardRepositoryProvider,
    CreateDeviceOperationCardUseCase,
    DeviceOperationCardHandlerUseCase,
  ],
  exports: [DeviceOperationCardHandlerUseCase],
})
export class DeviceOperationCardModule {}
