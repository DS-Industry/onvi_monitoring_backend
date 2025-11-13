import { Injectable, Logger } from '@nestjs/common';
import { HandlerTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-handler';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HandlerTechTaskCron {
  private readonly logger = new Logger(HandlerTechTaskCron.name);

  constructor(
    private readonly handlerTechTaskUseCase: HandlerTechTaskUseCase,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    const startTime = Date.now();
    this.logger.log('Starting tech task cron job execution');

    try {
      const result = await this.handlerTechTaskUseCase.execute();
      const executionTime = Date.now() - startTime;

      this.logger.log(
        `Tech task cron job completed successfully in ${executionTime}ms`,
        {
          executionTime,
          processedTasks: result?.processedTasks || 0,
          createdTasks: result?.createdTasks || 0,
          overdueTasksUpdated: result?.overdueTasksUpdated || 0,
        },
      );
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(`Tech task cron job failed after ${executionTime}ms`, {
        error: error.message,
        stack: error.stack,
        executionTime,
      });
    }
  }
}
