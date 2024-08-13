import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceDataRawRepositoryProvider } from '@device/device-data-raw/provider/device-data-raw';
import { CreateDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-create';
import { GetAllByStatusDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-get-all-by-status';
import { BullModule } from '@nestjs/bullmq';
import { CronDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-cron';
import { HandlerDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-handler';
import { DeviceOperationModule } from '@device/device-operation/device-operation.module';
import { DeviceProgramModule } from '@device/device-program/device-program/device-program.module';
import { DeviceEventModule } from '@device/device-event/device-event/device-event.module';
import { DeviceOperationCardModule } from '@device/device-operation-card/device-operation-card.module';
import { DeviceServiceModule } from '@device/device-service/device-service.module';
import { DeviceMfuModule } from '@device/device-mfu/device-mfu.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'deviceDataRaw',
    }),
    DeviceOperationModule,
    DeviceProgramModule,
    DeviceEventModule,
    DeviceOperationCardModule,
    DeviceServiceModule,
    DeviceMfuModule,
  ],
  providers: [
    DeviceDataRawRepositoryProvider,
    CreateDeviceDataRawUseCase,
    GetAllByStatusDeviceDataRawUseCase,
    CronDeviceDataRawUseCase,
    HandlerDeviceDataRawUseCase,
  ],
  exports: [
    CreateDeviceDataRawUseCase,
    GetAllByStatusDeviceDataRawUseCase,
    CronDeviceDataRawUseCase,
    HandlerDeviceDataRawUseCase,
  ],
})
export class DeviceDataRawModule {}
