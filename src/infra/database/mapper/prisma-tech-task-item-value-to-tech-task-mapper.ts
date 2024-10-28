import {
  TechTaskItemValueToTechTask as PrismaTechTaskItemValueToTechTask,
  Prisma,
} from '@prisma/client';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';

export class PrismaTechTaskItemValueToTechTaskMapper {
  static toDomain(
    entity: PrismaTechTaskItemValueToTechTask,
  ): TechTaskItemValueToTechTask {
    if (!entity) {
      return null;
    }
    return new TechTaskItemValueToTechTask({
      id: entity.id,
      techTaskId: entity.techTaskId,
      techTaskItemTemplateId: entity.techTaskItemTemplateId,
      value: entity.value,
    });
  }

  static toPrisma(
    techTaskItemValueToTechTask: TechTaskItemValueToTechTask,
  ): Prisma.TechTaskItemValueToTechTaskUncheckedCreateInput {
    return {
      id: techTaskItemValueToTechTask?.id,
      techTaskId: techTaskItemValueToTechTask.techTaskId,
      techTaskItemTemplateId:
        techTaskItemValueToTechTask.techTaskItemTemplateId,
      value: techTaskItemValueToTechTask?.value,
    };
  }
}
