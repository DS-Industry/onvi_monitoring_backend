import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer } from 'bullmq';
import { IFlowProducer, FlowJobConfig } from '@loyalty/order/interface/flow-producer.interface';

@Injectable()
export class BullMQFlowProducer implements IFlowProducer, OnModuleInit {
  private readonly flowProducer: FlowProducer;

  constructor(private readonly configService: ConfigService) {
    this.flowProducer = new FlowProducer({
      connection: {
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
      },
    });
  }

  async onModuleInit() {}

  async add(config: FlowJobConfig): Promise<void> {
    await this.flowProducer.add({
      name: config.name,
      queueName: config.queueName,
      data: config.data,
      children: config.children,
      opts: config.opts,
    });
  }
}


