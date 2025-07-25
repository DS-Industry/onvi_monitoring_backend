import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

export abstract class ITechTaskRepository {
  abstract create(input: TechTask): Promise<TechTask>;
  abstract findOneById(id: number): Promise<TechTask>;
  abstract findAllByFilter(
    posId?: number,
    gteStartDate?: Date,
    lteStartDate?: Date,
    gteEndSpecifiedDate?: Date,
    lteEndSpecifiedDate?: Date,
    gteNextCreateDate?: Date,
    lteNextCreateDate?: Date,
    type?: TypeTechTask,
    statuses?: StatusTechTask[],
    codeTag?: string,
    skip?: number,
    take?: number,
  ): Promise<TechTask[]>;
  abstract countAllByFilter(
    posId?: number,
    gteStartDate?: Date,
    lteStartDate?: Date,
    gteEndSpecifiedDate?: Date,
    lteEndSpecifiedDate?: Date,
    gteNextCreateDate?: Date,
    lteNextCreateDate?: Date,
    type?: TypeTechTask,
    statuses?: StatusTechTask[],
    codeTag?: string,
  ): Promise<number>;
  abstract findAllForUser(
    userId: number,
    statuses: StatusTechTask[],
    skip?: number,
    take?: number,
  ): Promise<TechTask[]>;
  abstract countAllForUser(
    userId: number,
    statuses: StatusTechTask[],
  ): Promise<number>;
  abstract update(input: TechTask): Promise<TechTask>;
  abstract updateConnectionTag(
    techTagId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
}
