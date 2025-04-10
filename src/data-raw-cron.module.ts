import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import process from 'process';
import { configuration } from '@config/configuration';
import { BullModule } from '@nestjs/bullmq';
import { PosModule } from '@pos/pos.module';
import { HandlerDeviceDataRawCron } from "./infra/handler/device-data-raw/cron/handler-device-data-raw";
import { ScheduleModule } from "@nestjs/schedule";
import { HandlerModule } from "./infra/handler/handler.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `config/env/.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        keepAlive: 30000,
        connectTimeout: 60000,
        retryStrategy: (times) => Math.min(times * 100, 3000),
      },
    }),
    ScheduleModule.forRoot(),
    PosModule,
  ],
  controllers: [],
  providers: [HandlerDeviceDataRawCron],
})
export class DataRawCronModule {}
