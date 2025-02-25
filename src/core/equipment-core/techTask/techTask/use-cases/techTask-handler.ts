import { Injectable } from '@nestjs/common';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask } from '@prisma/client';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import moment from 'moment';

@Injectable()
export class HandlerTechTaskUseCase {
  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
  ) {}

  async execute() {
    const year = moment().year().toString();
    const month = ('0' + (moment().month() + 1)).slice(-2);
    const day = ('0' + moment().date()).slice(-2);
    const today = new Date(year + '-' + month + '-' + day + ' 03:00:00');
    /*
        const techTaskActive = await this.findMethodsTechTaskUseCase.getAllByStatus(
          StatusTechTask.ACTIVE,       );
    /*
        const activeTasksWithFutureStartDate = techTaskActive.filter((task) => {
          const nextCreateDate = new Date(task.nextCreateDate);
          const nextCreateWithoutTime = nextCreateDate.toLocaleDateString();
          const todayWithoutTime = today.toLocaleDateString();
          return nextCreateWithoutTime == todayWithoutTime;
        });*/

    const activeTasksWithFutureStartDate =
      await this.findMethodsTechTaskUseCase.getAllForOverdue();

    await Promise.all(
      activeTasksWithFutureStartDate.map(async (item) => {
        await this.updateTechTaskUseCase.execute(
          { status: StatusTechTask.OVERDUE },
          item,
        );
      }),
    );

    const nextCreateTasksWithFutureStartDate =
      await this.findMethodsTechTaskUseCase.getAllForHandler();

    await Promise.all(
      nextCreateTasksWithFutureStartDate.map(async (item) => {
        const itemToTechTask =
          await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
            item.id,
          );
        const items = itemToTechTask.map((item) => item.techTaskItemTemplateId);
        await this.createTechTaskUseCase.execute(
          {
            name: item.name,
            posId: item.posId,
            type: item.type,
            period: item.period,
            startDate: today,
            techTaskItem: items,
          },
          item.createdById,
        );
      }),
    );
  }
}
