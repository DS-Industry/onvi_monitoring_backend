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

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

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
    Logger,
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config) => {
        // console.log('process.env: ', process.env);
        console.log('config: ', config.internalConfig.redisCachePassword);
        const redisConfig = {
          host:
            config.internalConfig.redisCacheHost || process.env.redisCacheHost,
          port: Number(config.internalConfig.redisCachePort),
          username: config.internalConfig.redisCacheUser,
          password: config.internalConfig.redisCachePassword,
        };

        console.log('Redis Cache Config:', {
          host: redisConfig.host,
          port: redisConfig.port,
          user: redisConfig.username,
          password: redisConfig.password ? redisConfig.password : undefined,
        });

        const keyvRedis = new KeyvRedis(redisConfig);

        // Test Redis connection
        keyvRedis.on('connect', () => {
          console.log('KeyvRedis connected successfully');
        });

        keyvRedis.on('error', (err) => {
          console.error('KeyvRedis connection error:', err);
        });

        const keyv = new Keyv({
          store: keyvRedis,
        });

        // Add error handling
        keyv.on('error', (err) => {
          console.error('Keyv Redis connection error:', err);
        });

        return {
          store: keyv,

          ttl: 3600000,
        };
      },
      isGlobal: true,
    }),
  ],
  controllers: [],

  providers: [],
})
export class AppModule {}
