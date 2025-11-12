import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import process from 'process';
import { configuration } from '@config/configuration';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '@db/prisma/prisma.module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { QueueModule } from '@infra/queue/queue.module';
import { PaymentOrchestrateConsumer } from '@infra/handler/payment-orchestrate/consumer/payment-orchestrate.consumer';
import { CarWashLaunchConsumer } from '@infra/handler/car-wash-launch/consumer/car-wash-launch.consumer';
import { CheckCarWashStartedConsumer } from '@infra/handler/check-car-wash-started/consumer/check-car-wash-started.consumer';
import { OrderFinishedConsumer } from '@infra/handler/main-flow/consumer/order-finished.consumer';
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
        customProps: () => ({
          context: 'HTTP',
        }),
      },
    }),
    RedisModule,
    PrismaModule,
    LoyaltyCoreModule,
    QueueModule,
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'payment-orchestrate',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'order-finished',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1,
      },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'pos-process',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'car-wash-launch',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      },
    }),
    BullModule.registerQueue({
      configKey: 'worker',
      name: 'check-car-wash-started',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],
  providers: [
    PaymentOrchestrateConsumer,
    OrderFinishedConsumer,
    CarWashLaunchConsumer,
    CheckCarWashStartedConsumer,
  ],
})
export class PaymentOrchestratorModule {}
