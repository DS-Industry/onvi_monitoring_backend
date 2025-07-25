import { Injectable } from '@nestjs/common';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask, TypeTechTask } from "@prisma/client";
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

    const activeTasksWithFutureStartDate =
      await this.findMethodsTechTaskUseCase.getAllByFilter({
        gteEndSpecifiedDate: todayUTC,
        lteEndSpecifiedDate: tomorrowUTC,
        statuses: [StatusTechTask.ACTIVE, StatusTechTask.RETURNED],
      });

    await Promise.all(
      activeTasksWithFutureStartDate.map(async (item) => {
        await this.updateTechTaskUseCase.execute(
          { status: StatusTechTask.OVERDUE },
          item,
        );
      }),
    );

    const nextCreateTasksWithFutureStartDate =
      await this.findMethodsTechTaskUseCase.getAllByFilter({
        gteNextCreateDate: todayUTC,
        lteNextCreateDate: tomorrowUTC,
        type: TypeTechTask.REGULAR,
        statuses: [StatusTechTask.FINISHED, StatusTechTask.OVERDUE],
      });

    await Promise.all(
      nextCreateTasksWithFutureStartDate.map(async (item) => {
        const itemToTechTask =
          await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
            item.id,
          );
        const items = itemToTechTask.map((item) => item.techTaskItemTemplateId);

        const techTags =
          await this.findMethodsTechTagUseCase.getAllByTechTaskId(item.id);
        const tagIds = techTags.map((item) => item.id);
        await this.createTechTaskUseCase.execute(
          {
            name: item.name,
            posId: item.posId,
            type: item.type,
            period: item.period,
            startDate: todayUTC,
            techTaskItem: items,
            tagIds: tagIds,
          },
          item.createdById,
        );
      }),
    );
  }
}
