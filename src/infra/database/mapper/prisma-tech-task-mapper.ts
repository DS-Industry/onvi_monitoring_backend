import { TechTask as PrismaTechTask, Prisma } from '@prisma/client';
import { TechTask } from '@tech-task/techTask/domain/techTask';

export class PrismaTechTaskMapper {
  static toDomain(entity: PrismaTechTask): TechTask {
    if (!entity) {
      return null;
    }
    return new TechTask({
      id: entity.id,
      name: entity.name,
      posId: entity.posId,
      type: entity.type,
      status: entity.status,
      period: entity.period,
      markdownDescription: entity.markdownDescription,
      nextCreateDate: entity.nextCreateDate,
      endSpecifiedDate: entity.endSpecifiedDate,
      startDate: entity.startDate,
      startWorkDate: entity.startWorkDate,
      sendWorkDate: entity.sendWorkDate,
      executorId: entity.executorId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updateById,
    });
  }

  static toPrisma(techTask: TechTask): Prisma.TechTaskUncheckedCreateInput {
    return {
      id: techTask?.id,
      name: techTask.name,
      posId: techTask?.posId,
      type: techTask.type,
      status: techTask.status,
      period: techTask?.period,
      markdownDescription: techTask?.markdownDescription,
      nextCreateDate: techTask?.nextCreateDate,
      endSpecifiedDate: techTask?.endSpecifiedDate,
      startDate: techTask.startDate,
      startWorkDate: techTask?.startWorkDate,
      sendWorkDate: techTask?.sendWorkDate,
      executorId: techTask?.executorId,
      createdAt: techTask?.createdAt,
      updatedAt: techTask?.updatedAt,
      createdById: techTask.createdById,
      updateById: techTask.updatedById,
    };
  }
}
