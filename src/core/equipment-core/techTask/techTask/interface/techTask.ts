import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

export abstract class ITechTaskRepository {
  abstract create(input: TechTask): Promise<TechTask>;
  abstract findOneById(id: number): Promise<TechTask>;
  abstract findAllByFilter(
    posId?: number,
    userId?: number,
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
    userId?: number,
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
  abstract update(input: TechTask): Promise<TechTask>;
  abstract updateConnectionTag(
    techTagId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any>;
  abstract delete(id: number): Promise<void>;
}
