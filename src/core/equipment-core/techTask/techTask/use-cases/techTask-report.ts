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
    posId?: number,
    type?: TypeTechTask,
    skip?: number,
    take?: number,
  ): Promise<TechTaskReadAllResponseDto> {
    const response: TechTaskReadAllResponse[] = [];
    const [totalCount, techTasks] = await Promise.all([
      this.findMethodsTechTaskUseCase.getCountByFilter({
        posId: posId,
        userId: user.id,
        statuses: [StatusTechTask.FINISHED],
        type: type,
      }),
      this.findMethodsTechTaskUseCase.getAllByFilter({
        posId: posId,
        userId: user.id,
        statuses: [StatusTechTask.FINISHED],
        type: type,
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
        type: techTask.type,
        status: techTask.status,
        endSpecifiedDate: techTask?.endSpecifiedDate,
        startWorkDate: techTask.startWorkDate,
        sendWorkDate: techTask.sendWorkDate,
        executorId: techTask.executorId,
        tags: techTags.map((tag) => tag.getProps()),
        createdBy: techTask.createdBy || null
      });
    }

    return {
      techTaskReadAll: response,
      totalCount: totalCount,
    };
  }
}
