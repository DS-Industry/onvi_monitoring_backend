import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

@Injectable()
export class FindMethodsTechTaskUseCase {
  constructor(private readonly techTaskRepository: ITechTaskRepository) {}

  async getById(input: number): Promise<TechTask> {
    return await this.techTaskRepository.findOneById(input);
  }

  async getAllByFilter(data: {
    posId?: number;
    userId?: number;
    gteStartDate?: Date;
    lteStartDate?: Date;
    gteEndSpecifiedDate?: Date;
    lteEndSpecifiedDate?: Date;
    gteNextCreateDate?: Date;
    lteNextCreateDate?: Date;
    type?: TypeTechTask;
    statuses?: StatusTechTask[];
    codeTag?: string;
    skip?: number;
    take?: number;
    organizationId?: number;
    name?: string;
    tags?: string[];
    authorId?: number;
    executorId?: number;
    templateToNextCreate?: boolean;
  }): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByFilter(
      data.posId,
      data.userId,
      data.gteStartDate,
      data.lteStartDate,
      data.gteEndSpecifiedDate,
      data.lteEndSpecifiedDate,
      data.gteNextCreateDate,
      data.lteNextCreateDate,
      data.type,
      data.statuses,
      data.codeTag,
      data.skip,
      data.take,
      data.organizationId,
      data.name,
      data.tags,
      data.authorId,
      data.executorId,
      data.templateToNextCreate,
    );
  }

  async getCountByFilter(data: {
    posId?: number;
    userId?: number;
    gteStartDate?: Date;
    lteStartDate?: Date;
    gteEndSpecifiedDate?: Date;
    lteEndSpecifiedDate?: Date;
    gteNextCreateDate?: Date;
    lteNextCreateDate?: Date;
    type?: TypeTechTask;
    statuses?: StatusTechTask[];
    codeTag?: string;
    organizationId?: number;
    name?: string;
    tags?: string[];
    authorId?: number;
    executorId?: number;
    templateToNextCreate?: boolean;
  }): Promise<number> {
    return await this.techTaskRepository.countAllByFilter(
      data.posId,
      data.userId,
      data.gteStartDate,
      data.lteStartDate,
      data.gteEndSpecifiedDate,
      data.lteEndSpecifiedDate,
      data.gteNextCreateDate,
      data.lteNextCreateDate,
      data.type,
      data.statuses,
      data.codeTag,
      data.organizationId,
      data.name,
      data.tags,
      data.authorId,
      data.executorId,
      data.templateToNextCreate,
    );
  }
}
