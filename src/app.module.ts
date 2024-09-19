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
import { HandlerDeviceDataRawModule } from './infra/handler-device-data-raw/handler-device-data-raw.module';
import { LoggerModule as Logger } from '../src/infra/logger/module';

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
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT,
        ),
        //password: 'Daster14!'
      },
    }),
    RouterModule.register(routeConfig),
    ScheduleModule.forRoot(),
    PrismaModule,
    PlatformAdminModule,
    PlatformUserModule,
    MobileUserModule,
    PlatformDeviceModule,
    BusinessCoreModule,
    HandlerDeviceDataRawModule,
    Logger,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
