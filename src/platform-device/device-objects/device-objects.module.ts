import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceObjectController } from './controller/device-object';
import { GetDeviceObjectByIdUseCase } from './use-cases/device-object-get-by-id';
import { DeviceObjectRepositoryProvider } from './provider/device-object';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceObjectController],
  providers: [DeviceObjectRepositoryProvider, GetDeviceObjectByIdUseCase],
  exports: [DeviceObjectRepositoryProvider, GetDeviceObjectByIdUseCase],
})
export class DeviceObjectModule {}
