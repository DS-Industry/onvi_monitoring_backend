import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskCreateDto } from '@tech-task/techTask/use-cases/dto/techTask-create.dto';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { PeriodTechTask, StatusTechTask } from '@prisma/client';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';

@Injectable()
export class CreateTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
  ) {}

  async execute(input: TechTaskCreateDto, userId: number): Promise<TechTask> {
    let nextCreateDate: Date;
    if (input.period == PeriodTechTask.Daily) {
      nextCreateDate = new Date(
        input.startDate.getTime() + 1000 * 60 * 60 * 24,
      );
    } else if (input.period == PeriodTechTask.Weekly) {
      nextCreateDate = new Date(
        input.startDate.getTime() + 1000 * 60 * 60 * 24 * 7,
      );
    } else if (input.period == PeriodTechTask.Monthly) {
      nextCreateDate = new Date(
        input.startDate.getTime() + 1000 * 60 * 60 * 24 * 31,
      );
    }
    const techTaskData = new TechTask({
      name: input.name,
      posId: input.posId,
      type: input.type,
      status: StatusTechTask.ACTIVE,
      period: input.period,
      nextCreateDate: nextCreateDate,
      startDate: input.startDate,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: userId,
      updatedById: userId,
    });
    const techTask = await this.techTaskRepository.create(techTaskData);

    const itemValueToTechTask: TechTaskItemValueToTechTask[] = [];

    await Promise.all(
      input.techTaskItem.map(async (item) => {
        itemValueToTechTask.push(
          new TechTaskItemValueToTechTask({
            techTaskId: techTask.id,
            techTaskItemTemplateId: item,
          }),
        );
      }),
    );
    this.techTaskItemValueToTechTaskRepository.createMany(itemValueToTechTask);
    return techTask;
  }
}
