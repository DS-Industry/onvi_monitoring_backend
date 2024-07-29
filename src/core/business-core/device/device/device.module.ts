import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceTypeModule } from '@device/deviceType/deviceType.module';
import { CarWashDeviceRepositoryProvider } from '@device/device/provider/device';
import { CreateCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-create';
import { GetFullDataCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-full-data';
import { DeviceDataRawModule } from '@device/device-data-raw/device-data-raw.module';

@Module({
  imports: [PrismaModule, DeviceTypeModule, DeviceDataRawModule],
  providers: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
  ],
  exports: [
    DeviceTypeModule,
    DeviceDataRawModule,
    CreateCarWashDeviceUseCase,
    GetFullDataCarWashDeviceUseCase,
  ],
})
export class DeviceModule {}
