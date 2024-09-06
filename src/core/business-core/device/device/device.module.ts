import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceTypeModule } from '@device/deviceType/deviceType.module';
import { CarWashDeviceRepositoryProvider } from '@device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { GetFullDataCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-full-data';
import { GetByIdCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-by-id';
import { GetAllByPosCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-all-by-pos';

@Module({
  imports: [PrismaModule, DeviceTypeModule],
  providers: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
    GetAllByPosCarWashDeviceUseCase,
  ],
  exports: [
    DeviceTypeModule,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
    GetAllByPosCarWashDeviceUseCase,
  ],
})
export class DeviceModule {}
