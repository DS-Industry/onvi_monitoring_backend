import { Injectable, Logger } from '@nestjs/common';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { startOfDay, endOfDay, format } from 'date-fns';
import { BatchProcessor } from '@tech-task/techTask/utils/batch-processor';
import { getTechTaskCronConfig } from '@tech-task/techTask/config/tech-task-cron.config';
import { TechTask } from '@tech-task/techTask/domain/techTask';

export interface TechTaskHandlerResult {
  processedTasks: number;
  createdTasks: number;
  overdueTasksUpdated: number;
  errors: string[];
}

@Injectable()
export class HandlerTechTaskUseCase {
  private readonly logger = new Logger(HandlerTechTaskUseCase.name);
  private readonly batchProcessor = new BatchProcessor();
  private readonly config = getTechTaskCronConfig();

  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(): Promise<TechTaskHandlerResult> {
    const todayUTC = startOfDay(new Date());
    const tomorrowUTC = endOfDay(new Date());

    const result: TechTaskHandlerResult = {
      processedTasks: 0,
      createdTasks: 0,
      overdueTasksUpdated: 0,
      errors: [],
    };

    this.logger.log(
      `Processing tech tasks for date range: ${format(todayUTC, 'yyyy-MM-dd')} to ${format(tomorrowUTC, 'yyyy-MM-dd')}`,
    );

    try {
      const overdueResult = await this.processOverdueTasks(todayUTC);
      result.overdueTasksUpdated = overdueResult.updated;
      result.errors.push(...overdueResult.errors);

      const recurringResult = await this.processRecurringTasks(
        todayUTC,
        tomorrowUTC,
      );
      result.createdTasks = recurringResult.created;
      result.processedTasks = recurringResult.processed;
      result.errors.push(...recurringResult.errors);

      this.logger.log(`Tech task processing completed`, result);
    } catch (error) {
      this.logger.error('Critical error in tech task processing', error);
      result.errors.push(`Critical error: ${error.message}`);
    }

    return result;
  }

  private async processOverdueTasks(
    todayUTC: Date,
  ): Promise<{ updated: number; errors: string[] }> {
    const result = { updated: 0, errors: [] };

    try {
      const yesterdayEnd = new Date(todayUTC);
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
      yesterdayEnd.setHours(23, 59, 59, 999);

      const activeTasks = await this.findMethodsTechTaskUseCase.getAllByFilter({
        lteEndSpecifiedDate: yesterdayEnd,
        statuses: [StatusTechTask.ACTIVE, StatusTechTask.RETURNED],
        take: this.config.maxTasksPerBatch,
      });

      this.logger.log(
        `Searching for overdue tasks with endSpecifiedDate <= ${format(yesterdayEnd, 'yyyy-MM-dd HH:mm:ss')}`,
      );

      this.logger.log(`Found ${activeTasks.length} tasks to mark as overdue`);

      if (activeTasks.length === 0) {
        return result;
      }

      const batchResult = await this.batchProcessor.processBatch(
        activeTasks,
        async (task: TechTask) => {
          await this.updateTechTaskUseCase.execute(
            { status: StatusTechTask.OVERDUE },
            task,
          );
          if (this.config.enableDetailedLogging) {
            this.logger.debug(`Marked task ${task.id} as overdue`);
          }
          return task.id;
        },
        {
          batchSize: this.config.batchSize,
          maxConcurrency: 5,
          timeoutMs: this.config.taskTimeoutMs,
          retryAttempts: this.config.maxRetries,
          retryDelayMs: this.config.retryDelayMs,
        },
      );

      result.updated = batchResult.successful.length;
      result.errors = batchResult.failed.map(
        (f) => `Failed to mark task as overdue: ${f.error.message}`,
      );

      this.logger.log(
        `Overdue tasks processing completed: ${result.updated} updated, ${result.errors.length} errors`,
      );
    } catch (error) {
      const errorMsg = `Failed to fetch overdue tasks: ${error.message}`;
      this.logger.error(errorMsg);
      result.errors.push(errorMsg);
    }

    return result;
  }

  private async processRecurringTasks(
    todayUTC: Date,
    tomorrowUTC: Date,
  ): Promise<{ processed: number; created: number; errors: string[] }> {
    const result = { processed: 0, created: 0, errors: [] };

    try {
      const allRecurringTasks =
        await this.findMethodsTechTaskUseCase.getAllByFilter({
          lteNextCreateDate: tomorrowUTC,
          type: TypeTechTask.REGULAR,
          statuses: [StatusTechTask.FINISHED, StatusTechTask.OVERDUE],
          take: this.config.maxTasksPerBatch,
        });

      const recurringTasks = allRecurringTasks.filter((task) => {
        if (!task.periodType) {
          this.logger.warn(
            `Skipping task ${task.id} (${task.name}) - missing periodType (legacy task)`,
          );
          return false;
        }
        return true;
      });

      this.logger.log(
        `Found ${recurringTasks.length} recurring tasks to process`,
      );
      if (this.config.enableDetailedLogging) {
        recurringTasks.forEach((task) => {
          this.logger.debug(
            `Task ${task.id} (${task.name}): nextCreateDate=${task.nextCreateDate}, status=${task.status}`,
          );
        });
      }
      result.processed = recurringTasks.length;

      if (recurringTasks.length === 0) {
        return result;
      }

      const batchResult = await this.batchProcessor.processBatch(
        recurringTasks,
        async (task: TechTask) => {
          return await this.createRecurringTask(task, todayUTC);
        },
        {
          batchSize: this.config.batchSize,
          maxConcurrency: 3,
          timeoutMs: this.config.taskTimeoutMs,
          retryAttempts: this.config.maxRetries,
          retryDelayMs: this.config.retryDelayMs,
        },
      );

      result.created = batchResult.successful.length;
      result.errors = batchResult.failed.map(
        (f) => `Failed to create recurring task: ${f.error.message}`,
      );

      this.logger.log(
        `Recurring tasks processing completed: ${result.created} created, ${result.errors.length} errors`,
      );
    } catch (error) {
      const errorMsg = `Failed to fetch recurring tasks: ${error.message}`;
      this.logger.error(errorMsg);
      result.errors.push(errorMsg);
    }

    return result;
  }

  private async createRecurringTask(
    task: TechTask,
    todayUTC: Date,
  ): Promise<number> {
    const tomorrowUTC = endOfDay(new Date());

    const existingTasksToday =
      await this.findMethodsTechTaskUseCase.getAllByFilter({
        posId: task.posId,
        gteStartDate: todayUTC,
        lteStartDate: tomorrowUTC,
        type: TypeTechTask.REGULAR,
        name: task.name,
      });

    const duplicateTask = existingTasksToday.find(
      (existingTask) =>
        existingTask.name === task.name &&
        existingTask.posId === task.posId &&
        existingTask.periodType === task.periodType &&
        existingTask.customPeriodDays === task.customPeriodDays &&
        existingTask.id !== task.id,
    );

    if (duplicateTask) {
      if (this.config.enableDetailedLogging) {
        this.logger.warn(
          `Skipping task creation for ${task.name} (ID: ${task.id}) - duplicate already exists (ID: ${duplicateTask.id})`,
        );
      }
      return duplicateTask.id;
    }

    const [items, tags] = await Promise.all([
      this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(task.id),
      this.findMethodsTechTagUseCase.getAllByTechTaskId(task.id),
    ]);
    const newTask = await this.createTechTaskUseCase.execute(
      {
        markdownDescription: task.markdownDescription,
        name: task.name,
        posId: task.posId,
        type: task.type,
        periodType: task.periodType,
        customPeriodDays: task.customPeriodDays,
        startDate: todayUTC,
        techTaskItem: items.map((item) => item.techTaskItemTemplateId),
        tagIds: tags.map((tag) => tag.id),
      },
      task.createdById,
    );

    if (this.config.enableDetailedLogging) {
      this.logger.log(
        `Created new recurring task: ${task.name} (Original ID: ${task.id}, New ID: ${newTask.id})`,
      );
    }

    return newTask.id;
  }
}
