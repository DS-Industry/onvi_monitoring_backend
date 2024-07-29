import { Module } from '@nestjs/common';
import { PrismaModule } from '@db/prisma/prisma.module';
import { DeviceDataRawRepositoryProvider } from '@device/device-data-raw/provider/device-data-raw';
import { CreateDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-create';
import { GetAllByStatusDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-get-all-by-status';
import { BullModule } from '@nestjs/bullmq';
import { CronDeviceDataRawUseCase } from '@device/device-data-raw/use-cases/device-data-raw-cron';
import { HandlerDeviceDataRawUseCase } from "@device/device-data-raw/use-cases/device-data-raw-handler";

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'deviceDataRaw',
    }),
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
