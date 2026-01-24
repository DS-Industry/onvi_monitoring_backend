import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer, Queue } from 'bullmq';
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
      const logFlowStructure = (children: any[], level: number = 0): string => {
        let result = '';
        const indent = '  '.repeat(level);
        children?.forEach((child, idx) => {
          result += `${indent}${idx > 0 ? '├─' : '└─'} ${child.queueName}:${child.name}\n`;
          if (child.children && child.children.length > 0) {
            result += logFlowStructure(child.children, level + 1);
          }
        });
        return result;
      };
      
      const flowStructure = config.children && config.children.length > 0
        ? `\n${logFlowStructure(config.children)}`
        : ' (no children)';
      
      this.logger.log(
        `[FlowProducer] Creating flow: ${config.queueName}:${config.name}${flowStructure}`,
      );
      
      const result = await this.flowProducer.add({
        name: config.name,
        queueName: config.queueName,
        data: config.data,
        children: config.children,
        opts: config.opts,
      });

      const flowNode = result as any;
      const rootJobId = flowNode?.job?.id || 'unknown';
    
      if (flowNode?.job) {
        try {
          const jobState = await flowNode.job.getState();
          this.logger.log(
            `[FlowProducer] Flow job added successfully: ${config.name} to queue: ${config.queueName}. Root job ID: ${rootJobId}, Initial state: ${jobState}`,
          );
        } catch (stateError) {
          this.logger.log(
            `[FlowProducer] Flow job added successfully: ${config.name} to queue: ${config.queueName}. Root job ID: ${rootJobId} (could not get initial state: ${stateError})`,
          );
        }
      } else {
        this.logger.log(
          `[FlowProducer] Flow job added successfully: ${config.name} to queue: ${config.queueName}. Root job ID: ${rootJobId} (job object not available)`,
        );
      }
      
      try {
        const queue = new Queue(config.queueName, {
          connection: this.getConnectionConfig(),
        });
        const job = await queue.getJob(rootJobId);
        if (job) {
          const state = await job.getState();
          this.logger.log(
            `[FlowProducer] Verified root job ${rootJobId} exists in queue ${config.queueName} with state: ${state}`,
          );
        } else {
          this.logger.warn(
            `[FlowProducer] WARNING: Root job ${rootJobId} not found in queue ${config.queueName} after creation!`,
          );
        }
        await queue.close();
      } catch (verifyError: any) {
        this.logger.warn(
          `[FlowProducer] Could not verify job in queue: ${verifyError?.message || verifyError}`,
        );
      }
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
