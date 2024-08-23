import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceRepositoryProvider } from './provider/car-wash-device';
import { CarWashDeviceController } from './controller/car-wash-device';
import { CreateCarWashDeviceUseCase } from './use-cases/create-car-wash-device';
import { UpdateCarWashDeviceUseCase } from './use-cases/update-car-wash-device';
import { GetByIdCarWashDeviceUseCase } from './use-cases/get-by-id-car-wash-device';

@Module({
  imports: [PrismaModule],
  controllers: [CarWashDeviceController],
  providers: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    UpdateCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
  ],
  exports: [
    CarWashDeviceRepositoryProvider,
    CreateCarWashDeviceUseCase,
    UpdateCarWashDeviceUseCase,
    GetByIdCarWashDeviceUseCase,
  ],
})
export class CarWashDeviceModule {}
