import { Injectable } from '@nestjs/common';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';

@Injectable()
export class HandlerTechTaskUseCase {
  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute() {
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    await this.processOverdueTasks(todayUTC, tomorrowUTC);

    await this.processRecurringTasks(todayUTC, tomorrowUTC);
  }

  private async processOverdueTasks(todayUTC: Date, tomorrowUTC: Date) {
    const activeTasks = await this.findMethodsTechTaskUseCase.getAllByFilter({
      gteEndSpecifiedDate: todayUTC,
      lteEndSpecifiedDate: tomorrowUTC,
      statuses: [StatusTechTask.ACTIVE, StatusTechTask.RETURNED],
    });

    for (const task of activeTasks) {
      await this.updateTechTaskUseCase.execute(
        { status: StatusTechTask.OVERDUE },
        task,
      );
    }
  }

  private async processRecurringTasks(todayUTC: Date, tomorrowUTC: Date) {
    const recurringTasks = await this.findMethodsTechTaskUseCase.getAllByFilter(
      {
        gteNextCreateDate: todayUTC,
        lteNextCreateDate: tomorrowUTC,
        type: TypeTechTask.REGULAR,
        statuses: [StatusTechTask.FINISHED, StatusTechTask.OVERDUE],
      },
    );

    for (const task of recurringTasks) {
      const [items, tags] = await Promise.all([
        this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(task.id),
        this.findMethodsTechTagUseCase.getAllByTechTaskId(task.id),
      ]);

      await this.createTechTaskUseCase.execute(
        {
          name: task.name,
          posId: task.posId,
          type: task.type,
          period: task.period,
          startDate: todayUTC,
          techTaskItem: items.map((item) => item.techTaskItemTemplateId),
          tagIds: tags.map((tag) => tag.id),
        },
        task.createdById,
      );
    }
  }
}
