import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceEventTypeRepositoryProvider } from '@device/device-event/device-event-type/provider/device-event-type';
import { GetByIdDeviceEventTypeUseCase } from '@device/device-event/device-event-type/use-case/device-event-type-get-by-id';

@Module({
  imports: [PrismaModule],
  providers: [DeviceEventTypeRepositoryProvider, GetByIdDeviceEventTypeUseCase],
  exports: [GetByIdDeviceEventTypeUseCase],
})
export class DeviceEventTypeModule {}
