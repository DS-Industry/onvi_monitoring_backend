import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import {
  TechTaskReadAllResponse,
  TechTaskReadAllResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class ReportTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    user: User,
    filterData: {
      posId?: number;
      organizationId?: number;
      type?: TypeTechTask;
      name?: string;
      executorId?: number;
      tags?: string[];
      startDate?: Date;
      endDate?: Date;
      authorId?: number;
    },
    skip?: number,
    take?: number,
  ): Promise<TechTaskReadAllResponseDto> {
    const response: TechTaskReadAllResponse[] = [];
    const [totalCount, techTasks] = await Promise.all([
      this.findMethodsTechTaskUseCase.getCountByFilter({
        posId: filterData.posId,
        userId: user.id,
        organizationId: filterData.organizationId,
        statuses: [StatusTechTask.FINISHED],
        type: filterData.type,
        name: filterData.name,
        tags: filterData.tags,
        gteStartDate: filterData.startDate,
        lteEndSpecifiedDate: filterData.endDate,
        authorId: filterData.authorId,
        executorId: filterData.executorId,
      }),
      this.findMethodsTechTaskUseCase.getAllByFilter({
        posId: filterData.posId,
        userId: user.id,
        organizationId: filterData.organizationId,
        statuses: [StatusTechTask.FINISHED],
        type: filterData.type,
        name: filterData.name,
        tags: filterData.tags,
        gteStartDate: filterData.startDate,
        lteEndSpecifiedDate: filterData.endDate,
        authorId: filterData.authorId,
        executorId: filterData.executorId,
        skip: skip,
        take: take,
      }),
    ]);
    for (const techTask of techTasks) {
      const techTags = await this.findMethodsTechTagUseCase.getAllByTechTaskId(
        techTask.id,
      );
      response.push({
        id: techTask.id,
        name: techTask.name,
        posId: techTask.posId,
        posName: techTask.posName,
        type: techTask.type,
        status: techTask.status,
        endSpecifiedDate: techTask?.endSpecifiedDate,
        startWorkDate: techTask.startWorkDate,
        sendWorkDate: techTask.sendWorkDate,
        executorId: techTask.executorId,
        tags: techTags.map((tag) => tag.getProps()),
        createdBy: techTask.createdBy || null,
        executor: techTask.executor || null,
        templateToNextCreate: techTask.templateToNextCreate,
      });
    }

    return {
      techTaskReadAll: response,
      totalCount: totalCount,
    };
  }
}
