import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceTypeModule } from '@device/deviceType/deviceType.module';
import { CarWashDeviceRepositoryProvider } from '@device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { GetFullDataCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-full-data';

@Module({
  imports: [PrismaModule, DeviceTypeModule],
  providers: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
  ],
  exports: [
    DeviceTypeModule,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
  ],
})
export class DeviceModule {}
