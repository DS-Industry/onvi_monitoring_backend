import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DevicePermissionsRepositoryProvider } from './provider/device-permission';
import { CreateDevicePermissionUseCase } from './use-cases/permission-create';
import { GetAllDevicePermissionsUseCase } from './use-cases/permission-get-all';
import { GetDevicePermissionByIdUseCase } from './use-cases/permission-get-by-id';
import { DevicePermissionsController } from './controller/device-permission';

@Module({
  imports: [PrismaModule],
  controllers: [DevicePermissionsController],
  providers: [
    DevicePermissionsRepositoryProvider,
    CreateDevicePermissionUseCase,
    GetAllDevicePermissionsUseCase,
    GetDevicePermissionByIdUseCase,
  ],
  exports: [],
})
export class DevicePermissionsModule {}
