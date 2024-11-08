import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskUpdateDto } from '@tech-task/techTask/use-cases/dto/techTask-update.dto';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { User } from '@platform-user/user/domain/user';
import { StatusTechTask } from '@prisma/client';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';

@Injectable()
export class UpdateTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
  ) {}

  async execute(
    input: TechTaskUpdateDto,
    oldTechTask: TechTask,
    user?: User,
  ): Promise<TechTask> {
    const { name, type, status, period } = input;

    oldTechTask.name = name ? name : oldTechTask.name;
    oldTechTask.type = type ? type : oldTechTask.type;
    oldTechTask.status = status ? status : oldTechTask.status;
    oldTechTask.period = period ? period : oldTechTask.period;
    oldTechTask.updatedAt = new Date(Date.now());

    if (status && status == StatusTechTask.PAUSE) {
      oldTechTask.nextCreateDate = null;
    }

    if (user) {
      oldTechTask.updatedById = user.id;
    }

    if (input.techTaskItem) {
      const itemToTechTask =
        await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
          oldTechTask.id,
        );
      const oldItems = itemToTechTask.map(
        (item) => item.techTaskItemTemplateId,
      );
      const newItems = input.techTaskItem;

      const deleteItems = oldItems.filter((item) => !newItems.includes(item));
      const createItems = newItems.filter((item) => !oldItems.includes(item));

      if (deleteItems.length > 0) {
        this.techTaskItemValueToTechTaskRepository.deleteMany(
          oldTechTask.id,
          deleteItems,
        );
      }
      if (createItems.length > 0) {
        const itemValueToTechTask: TechTaskItemValueToTechTask[] = [];

        await Promise.all(
          createItems.map(async (item) => {
            itemValueToTechTask.push(
              new TechTaskItemValueToTechTask({
                techTaskId: oldTechTask.id,
                techTaskItemTemplateId: item,
              }),
            );
          }),
        );
        this.techTaskItemValueToTechTaskRepository.createMany(
          itemValueToTechTask,
        );
      }
    }
    return await this.techTaskRepository.update(oldTechTask);
  }
}
