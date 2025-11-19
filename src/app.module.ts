import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { configuration } from '@config/configuration';
import * as process from 'process';
import { RouterModule } from '@nestjs/core';
import { routeConfig } from '@utils/route.config';
import { PlatformAdminModule } from '@platform-admin/platform-admin.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { PlatformUserModule } from '@platform-user/platform-user.module';
import { MobileUserModule } from '@mobile-user/mobile-user.module';
import { BusinessCoreModule } from '@business-core/business-core.module';
import { PlatformDeviceModule } from '@platform-device/platform-device.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule as Logger } from '../src/infra/logger/module';
import { EquipmentCoreModule } from './core/equipment-core/equipment-core.module';
import { WarehouseCoreModule } from '@warehouse/warehouse-core.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { FinanceCoreModule } from '@finance/finance-core.module';
import { ReportCoreModule } from '@report/report-core.module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { HrCoreModule } from '@hr/hr-core.module';
import { NotificationCoreModule } from '@notification/notification-core.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ManagerPaperCoreModule } from '@manager-paper/manager-paper-core.module';
import { PaymentModule } from './app/payment/payment.module';

import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@infra/cache/redis.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheSWRInterceptor } from '@common/interceptors/cache-swr.interceptor';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '@libs/multer/multerConfig';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'developmen'
          ? {
              customProps: () => ({
                context: 'HTTP',
              }),
              transport: {
                dedupe: true,
                targets: [
                  {
                    target: 'pino/file',
                    options: {
                      destination: './logs',
                      mkdir: true,
                    },
                  },
                ],
              },
            }
          : {
              customProps: () => ({
                context: 'HTTP',
              }),
              transport: {
                dedupe: true,
                targets: [
                  {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                    },
                    level: '',
                  },
                ],
              },
            },
    }),
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
    RouterModule.register(routeConfig),
    ScheduleModule.forRoot(),
    PrometheusModule.register(),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    MulterModule.register(multerConfig),
    PrismaModule,
    PlatformAdminModule,
    PlatformUserModule,
    MobileUserModule,
    LoyaltyCoreModule,
    PlatformDeviceModule,
    BusinessCoreModule,
    EquipmentCoreModule,
    WarehouseCoreModule,
    FinanceCoreModule,
    HrCoreModule,
    ReportCoreModule,
    NotificationCoreModule,
    ManagerPaperCoreModule,
    PaymentModule,
    Logger,
    RedisModule,
  ],
  controllers: [],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheSWRInterceptor,
    },
  ],
})
export class AppModule {}
