import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import process from 'process';
import { configuration } from '@config/configuration';
import { BullModule } from '@nestjs/bullmq';
import { PosModule } from '@pos/pos.module';
import { HandlerDeviceDataRawCron } from '../../infra/handler/device-data-raw/cron/handler-device-data-raw';
import { ScheduleModule } from '@nestjs/schedule';
import { HandlerTechTaskCron } from '../../infra/handler/techTask/cron/handler-techTask';
import { TechTaskModule } from '@tech-task/tech-task.module';
import { TestDataCron } from '../../infra/handler/testData/cron/testData';
import { TestDataTechTaskCron } from '../../infra/handler/testData/cron/testDataTechTask';
import { HandlerManagerPaperCron } from '../../infra/handler/managerPaper/cron/handler-managerPaper';
import { PlatformUserModule } from '@platform-user/platform-user.module';
import { ManagerPaperCoreModule } from '@manager-paper/manager-paper-core.module';
import { EventEmitterModule } from "@nestjs/event-emitter";

const cronUseCases: Provider[] = [
  HandlerDeviceDataRawCron,
  HandlerTechTaskCron,
  TestDataCron,
  TestDataTechTaskCron,
  HandlerManagerPaperCron,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `config/env/.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    BullModule.forRoot('data_raw', {
      connection: {
        host: process.env.REDIS_DEVICE_DATA_HOST,
        port: Number(process.env.REDIS_DEVICE_DATA_PORT),
        username: process.env.REDIS_DEVICE_DATA_USER,
        password: process.env.REDIS_DEVICE_DATA_PASSWORD,
        keepAlive: 30000,
        connectTimeout: 60000,
        retryStrategy: (times) => Math.min(times * 100, 3000),
      },
    }),
    BullModule.forRoot('worker', {
      connection: {
        host: process.env.REDIS_WORKER_DATA_HOST,
        port: Number(process.env.REDIS_WORKER_DATA_PORT),
        username: process.env.REDIS_WORKER_DATA_USER,
        password: process.env.REDIS_WORKER_DATA_PASSWORD,
        keepAlive: 30000,
        connectTimeout: 60000,
        retryStrategy: (times) => Math.min(times * 100, 3000),
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    PosModule,
    TechTaskModule,
    ManagerPaperCoreModule,
    PlatformUserModule,
  ],
  controllers: [],
  providers: [...cronUseCases],
})
export class CronModule {}
