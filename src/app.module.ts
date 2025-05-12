import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
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
import { HandlerModule } from './infra/handler/handler.module';
import { WarehouseCoreModule } from '@warehouse/warehouse-core.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { FinanceCoreModule } from '@finance/finance-core.module';
import { ReportCoreModule } from '@report/report-core.module';
import { LoyaltyCoreModule } from './core/loyalty-core/loyalty-core.module';
import { HrCoreModule } from '@hr/hr-core.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV === 'development'
          ? {
              customProps: (req, res) => ({
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
              customProps: (req, res) => ({
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
      }
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
      }
    }),
    RouterModule.register(routeConfig),
    ScheduleModule.forRoot(),
    PrometheusModule.register(),
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
    HandlerModule,
    Logger,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
