import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceRoleRepositoryProvider } from './provider/device.role';
import { GetDeviceRoleByIdUseCase } from './use-cases/device-role-get-by-id';
import { GetPermissionsByRoleIdUseCase } from './use-cases/device-role-get-permission-by-id';
import { DeviceRoleController } from './controller/device-role';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceRoleController],
  providers: [
    DeviceRoleRepositoryProvider,
    GetDeviceRoleByIdUseCase,
    GetPermissionsByRoleIdUseCase,
  ],
  exports: [],
})
export class DeviceRoleModule {}
