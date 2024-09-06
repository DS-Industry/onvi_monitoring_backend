import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceTypeRepositoryProvider } from '@device/deviceType/provider/deviceType';
import { CreateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-create';
import { UpdateCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-update';
import { GetByIdCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [
    CarWashDeviceTypeRepositoryProvider,
    CreateCarWashDeviceTypeUseCase,
    UpdateCarWashDeviceTypeUseCase,
    GetByIdCarWashDeviceTypeUseCase,
  ],
  exports: [
    CreateCarWashDeviceTypeUseCase,
    UpdateCarWashDeviceTypeUseCase,
    GetByIdCarWashDeviceTypeUseCase,
  ],
})
export class DeviceTypeModule {}
