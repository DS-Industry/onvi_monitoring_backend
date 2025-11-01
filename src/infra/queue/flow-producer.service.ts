import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer } from 'bullmq';
import { IFlowProducer, FlowJobConfig } from '@loyalty/order/interface/flow-producer.interface';

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
    try {
      await this.flowProducer.add({
        name: config.name,
        queueName: config.queueName,
        data: config.data,
        children: config.children,
        opts: config.opts,
      });
    } catch (error) {
      this.logger.error(
        `Failed to add flow job: ${config.name} to queue: ${config.queueName}`,
        error.stack,
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
      keepAlive: 30000,
      connectTimeout: 60000,
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    };
  }
}


