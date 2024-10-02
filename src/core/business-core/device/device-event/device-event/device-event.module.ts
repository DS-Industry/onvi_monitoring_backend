import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceEventRepositoryProvider } from '@device/device-event/device-event/provider/device-event';
import { DeviceEventTypeModule } from '@device/device-event/device-event-type/device-event-type.module';
import { CreateDeviceEventUseCase } from '@device/device-event/device-event/use-case/device-event-create';
import { DeviceEventHandlerUseCase } from '@device/device-event/device-event/use-case/device-event-handler';
import { PosModule } from "@pos/pos.module";

@Module({
  imports: [PrismaModule, DeviceEventTypeModule, PosModule],
  providers: [
    DeviceEventRepositoryProvider,
    CreateDeviceEventUseCase,
    DeviceEventHandlerUseCase,
  ],
  exports: [DeviceEventHandlerUseCase],
})
export class DeviceEventModule {}
