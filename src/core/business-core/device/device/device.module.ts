import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceTypeModule } from '@device/deviceType/deviceType.module';
import { CarWashDeviceRepositoryProvider } from '@device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { GetFullDataCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-full-data';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';

@Module({
  imports: [PrismaModule, DeviceTypeModule],
  providers: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
  ],
  exports: [
    DeviceTypeModule,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
  ],
})
export class DeviceModule {}
