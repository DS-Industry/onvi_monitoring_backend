import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';

export abstract class ITechTaskItemValueToTechTaskRepository {
  abstract create(
    input: TechTaskItemValueToTechTask,
  ): Promise<TechTaskItemValueToTechTask>;
  abstract createMany(input: TechTaskItemValueToTechTask[]): void;
  abstract deleteMany(
    techTaskId: number,
    techTaskItemTemplateIds: number[],
  ): void;
  abstract findAllByTaskId(
    techTaskId: number,
  ): Promise<TechTaskItemValueToTechTask[]>;
  abstract findAllByTaskIds(
    techTaskIds: number[],
  ): Promise<TechTaskItemValueToTechTask[]>;
  abstract updateValue(
    id: number,
    value: string,
    image?: string,
  ): Promise<TechTaskItemValueToTechTask>;
}
