import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import {
  TechTaskReadAllResponse,
  TechTaskReadAllResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { StatusTechTask } from '@prisma/client';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class ReadAllByPosTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    user: User,
    filterData: { 
      posId?: number; 
      status?: StatusTechTask; 
      organizationId?: number;
      name?: string;
      tags?: string[];
      startDate?: Date;
      endDate?: Date;
      authorId?: number;
    },
    skip?: number,
    take?: number,
  ): Promise<TechTaskReadAllResponseDto> {
    const response: TechTaskReadAllResponse[] = [];

    const statuses =
      filterData.status !== undefined
        ? [filterData.status]
        : undefined;

    const [totalCount, techTasks] = await Promise.all([
      this.findMethodsTechTaskUseCase.getCountByFilter({
        userId: user.id,
        statuses,
        posId: filterData.posId,
        organizationId: filterData.organizationId,
        name: filterData.name,
        tags: filterData.tags,
        gteStartDate: filterData.startDate,
        lteEndSpecifiedDate: filterData.endDate,
        authorId: filterData.authorId,
      }),
      this.findMethodsTechTaskUseCase.getAllByFilter({
        userId: user.id,
        statuses,
        posId: filterData.posId,
        organizationId: filterData.organizationId,
        name: filterData.name,
        tags: filterData.tags,
        gteStartDate: filterData.startDate,
        lteEndSpecifiedDate: filterData.endDate,
        authorId: filterData.authorId,
        skip,
        take,
      }),
    ]);
    for (const techTask of techTasks) {
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
        tags: techTask.tags.map((tag) => tag.getProps()),
        createdBy: techTask.createdBy || null,
      });
    }

    return {
      techTaskReadAll: response,
      totalCount: totalCount,
    };
  }
}
