import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { TechTaskCompletionShapeValueDto } from '@tech-task/techTask/use-cases/dto/techTask-completion-shape-value.dto';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { StatusTechTask } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class CompletionShapeTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
  ) {}

  async execute(
    techTask: TechTask,
    value: TechTaskCompletionShapeValueDto[],
    user: User,
  ): Promise<any> {
    await Promise.all(
      value.map(
        async (itemValue) =>
          await this.techTaskItemValueToTechTaskRepository.updateValue(
            itemValue.itemValueId,
            itemValue.value,
          ),
      ),
    );
    techTask.status = StatusTechTask.FINISHED;
    techTask.sendWorkDate = new Date();
    techTask.executorId = user.id;
    return await this.techTaskRepository.update(techTask);
  }
}
