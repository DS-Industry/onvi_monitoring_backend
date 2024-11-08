import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask } from '@prisma/client';

export abstract class ITechTaskRepository {
  abstract create(input: TechTask): Promise<TechTask>;
  abstract findOneById(id: number): Promise<TechTask>;
  abstract findAllByPosId(posId: number): Promise<TechTask[]>;
  abstract findAllByPosIdAndStatuses(
    posId: number,
    statuses: StatusTechTask[],
  ): Promise<TechTask[]>;
  abstract findAllByStatus(status: StatusTechTask): Promise<TechTask[]>;
  abstract update(input: TechTask): Promise<TechTask>;
}
