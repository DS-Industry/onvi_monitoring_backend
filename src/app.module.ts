import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '@config/configuration';
import { PrismaModule } from '@prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from './core/core.module';
import { PlatformUserModule } from './platform-user/platform-user.module';
import { PlatformAdminModule } from './platform-admin/platform-admin.module';
import { MobileUserModule } from './mobile-user/mobile-user.module';
import { PlatformDeviceModule } from './platform-device/platform-device.module';
import { BusinessCoreModule } from './core/business-core/business-core.module';
import { AccountingCoreModule } from './core/accounting-core/accounting-core.module';
import { LoyaltyCoreModule } from './core/loyalty-core/loyalty-core.module';
import * as process from 'process';

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
    PassportModule.register({}),
    PrismaModule,
    CoreModule,
    PlatformUserModule,
    PlatformAdminModule,
    MobileUserModule,
    PlatformDeviceModule,
    BusinessCoreModule,
    AccountingCoreModule,
    LoyaltyCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
