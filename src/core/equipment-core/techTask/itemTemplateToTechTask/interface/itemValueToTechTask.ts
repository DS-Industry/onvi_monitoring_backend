import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';

export abstract class ITechTaskItemValueToTechTaskRepository {
  abstract create(
    input: TechTaskItemValueToTechTask,
  ): Promise<TechTaskItemValueToTechTask>;
  abstract findAllByTaskId(
    techTaskId: number,
  ): Promise<TechTaskItemValueToTechTask[]>;
}
