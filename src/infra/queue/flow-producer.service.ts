import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer } from 'bullmq';
import {
  IFlowProducer,
  FlowJobConfig,
} from '@loyalty/order/interface/flow-producer.interface';

@Injectable()
export class BullMQFlowProducer implements IFlowProducer, OnModuleDestroy {
  private readonly logger = new Logger(BullMQFlowProducer.name);
  private readonly flowProducer: FlowProducer;

  constructor(private readonly configService: ConfigService) {
    this.flowProducer = new FlowProducer({
      connection: this.getConnectionConfig(),
    });
    this.logger.log('FlowProducer initialized');
  }

  async onModuleDestroy() {
    await this.flowProducer.close();
    this.logger.log('FlowProducer closed');
  }

  async add(config: FlowJobConfig): Promise<void> {
    if (!config.name) {
      throw new Error('FlowJobConfig.name is required');
    }
    if (!config.queueName) {
      throw new Error('FlowJobConfig.queueName is required');
    }

    try {
      await this.flowProducer.add({
        name: config.name,
        queueName: config.queueName,
        data: config.data,
        children: config.children,
        opts: config.opts,
      });

      this.logger.debug(
        `Flow job added successfully: ${config.name} to queue: ${config.queueName}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to add flow job: ${config.name} to queue: ${config.queueName}. Error: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  private getConnectionConfig() {
    return {
      host:
        this.configService.get<string>('REDIS_WORKER_DATA_HOST') ||
        this.configService.get<string>('REDIS_HOST') ||
        'localhost',
      port: parseInt(
        this.configService.get<string>('REDIS_WORKER_DATA_PORT') ||
          this.configService.get<string>('REDIS_PORT') ||
          '6379',
        10,
      ),
      username: this.configService.get<string>('REDIS_WORKER_DATA_USER'),
      password:
        this.configService.get<string>('REDIS_WORKER_DATA_PASSWORD') ||
        this.configService.get<string>('REDIS_PASSWORD'),
      keepAlive: parseInt(
        this.configService.get<string>('REDIS_KEEPALIVE') || '30000',
        10,
      ),
      connectTimeout: parseInt(
        this.configService.get<string>('REDIS_CONNECT_TIMEOUT') || '60000',
        10,
      ),
      retryStrategy: (times: number) => {
        const maxDelay = parseInt(
          this.configService.get<string>('REDIS_RETRY_MAX_DELAY') || '3000',
          10,
        );
        return Math.min(times * 100, maxDelay);
      },
    };
  }
}
