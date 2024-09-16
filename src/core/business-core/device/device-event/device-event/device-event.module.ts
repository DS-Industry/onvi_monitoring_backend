import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceEventRepositoryProvider } from '@device/device-event/device-event/provider/device-event';
import { DeviceEventTypeModule } from '@device/device-event/device-event-type/device-event-type.module';
import { DeviceModule } from '@device/device/device.module';
import { CreateDeviceEventUseCase } from '@device/device-event/device-event/use-case/device-event-create';
import { DeviceEventHandlerUseCase } from '@device/device-event/device-event/use-case/device-event-handler';

@Module({
  imports: [PrismaModule, DeviceEventTypeModule, DeviceModule],
  providers: [
    DeviceEventRepositoryProvider,
    CreateDeviceEventUseCase,
    DeviceEventHandlerUseCase,
  ],
  exports: [DeviceEventHandlerUseCase],
})
export class DeviceEventModule {}
