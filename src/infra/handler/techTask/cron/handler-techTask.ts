import { Injectable } from '@nestjs/common';
import { HandlerTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-handler';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HandlerTechTaskCron {
  constructor(
    private readonly handlerTechTaskUseCase: HandlerTechTaskUseCase,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    await this.handlerTechTaskUseCase.execute();
  }
}
