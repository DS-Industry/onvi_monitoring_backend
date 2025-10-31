import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import process from 'process';
import { configuration } from '@config/configuration';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@db/prisma/prisma.module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PaymentOrchestrateConsumer } from '@infra/handler/payment-orchestrate/consumer/payment-orchestrate.consumer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from '@infra/cache/redis.module';
import { LoggerModule } from 'nestjs-pino';

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
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
      },
    }),
    RedisModule,
    PrismaModule,
    LoyaltyCoreModule,
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'payment-orchestrate',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 3 },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'order-finished',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 1 },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'pos-process',
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true, attempts: 3 },
    }),
  ],
  providers: [PaymentOrchestrateConsumer],
})
export class PaymentOrchestratorModule {}




