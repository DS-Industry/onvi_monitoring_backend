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
  }): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByFilter(
      data.posId,
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
    );
  }

  async getCountByFilter(data: {
    posId?: number;
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
  }): Promise<number> {
    return await this.techTaskRepository.countAllByFilter(
      data.posId,
      data.gteStartDate,
      data.lteStartDate,
      data.gteEndSpecifiedDate,
      data.lteEndSpecifiedDate,
      data.gteNextCreateDate,
      data.lteNextCreateDate,
      data.type,
      data.statuses,
      data.codeTag,
    );
  }

  async getAllForUser(
    userId: number,
    statuses: StatusTechTask[],
    skip?: number,
    take?: number,
  ): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllForUser(
      userId,
      statuses,
      skip,
      take,
    );
  }

  async getCountForUser(
    userId: number,
    statuses: StatusTechTask[],
  ): Promise<number> {
    return await this.techTaskRepository.countAllForUser(
      userId,
      statuses,
    );
  }
}
