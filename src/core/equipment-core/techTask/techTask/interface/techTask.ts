import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

export abstract class ITechTaskRepository {
  abstract create(input: TechTask): Promise<TechTask>;
  abstract findOneById(id: number): Promise<TechTask>;
  abstract findAllByPosId(posId: number): Promise<TechTask[]>;
  abstract findAllByPosIdAndStatuses(
    posId: number,
    statuses: StatusTechTask[],
  ): Promise<TechTask[]>;
  abstract findAllByPosIdsAndStatuses(
    posIds: number[],
    statuses: StatusTechTask[],
  ): Promise<TechTask[]>;
  abstract findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    status: StatusTechTask
  ): Promise<TechTask[]>;
  abstract findAllByTypeAndPosIdAndDate(
    posId: number,
    type: TypeTechTask,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]>;
  abstract findAllByTypeAndPosIdsAndDate(
    posIds: number[],
    type: TypeTechTask,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]>;
  abstract findAllCodeTagAndPosIdsAndDate(
    posIds: number[],
    codeTag: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]>;
  abstract findAllByStatus(status: StatusTechTask): Promise<TechTask[]>;
  abstract findAllForHandler(): Promise<TechTask[]>;
  abstract findAllForOverdue(): Promise<TechTask[]>;
  abstract update(input: TechTask): Promise<TechTask>;
  abstract updateConnectionTag(
    techTagId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
}
