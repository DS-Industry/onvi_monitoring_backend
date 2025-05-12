import { Module } from '@nestjs/common';
import { DeviceApiKeyController } from '@platform-device/auth/controller/auth';
import { FindDeviceApiKeysByKeyUseCase } from '@platform-device/auth/use-cases/api-get-by-id';
import { CreateDeviceApiKeyUseCase } from '@platform-device/auth/use-cases/create-api-key';
import { PlatformDeviceApiKeyRepositoryProvider } from '@platform-device/auth/provider/auth';
import { PrismaModule } from '@db/prisma/prisma.module';
import { CarWashDeviceAbilityModule } from '@platform-device/permissions/ability.module';

@Module({
  imports: [PrismaModule, CarWashDeviceAbilityModule],
  controllers: [DeviceApiKeyController],
  providers: [
    PlatformDeviceApiKeyRepositoryProvider,
    FindDeviceApiKeysByKeyUseCase,
    CreateDeviceApiKeyUseCase,
  ],
  exports: [PlatformDeviceApiKeyRepositoryProvider],
})
export class DeviceAuthModule {}
