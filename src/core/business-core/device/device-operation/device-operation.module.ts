import { Module } from '@nestjs/common';
import { DeviceOperationRepositoryProvider } from '@device/device-operation/provider/device-operation';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceOperationHandlerUseCase } from '@device/device-operation/use-cases/device-operation-handler';
import { DeviceModule } from '@device/device/device.module';
import { CurrencyCarWashPosModule } from '@device/currency/currency-car-wash-pos/currency-car-wash-pos.module';
import { CreateDeviceOperationUseCase } from '@device/device-operation/use-cases/device-operation-create';

@Module({
  imports: [PrismaModule, DeviceModule, CurrencyCarWashPosModule],
  providers: [
    DeviceOperationRepositoryProvider,
    DeviceOperationHandlerUseCase,
    CreateDeviceOperationUseCase,
  ],
  exports: [DeviceOperationHandlerUseCase],
})
export class DeviceOperationModule {}
