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
    filterData: { posId?: number; status?: StatusTechTask },
    skip?: number,
    take?: number,
  ): Promise<TechTaskReadAllResponseDto> {
    const response: TechTaskReadAllResponse[] = [];

    let statuses: StatusTechTask[] = [
      StatusTechTask.ACTIVE,
      StatusTechTask.OVERDUE,
      StatusTechTask.RETURNED,
    ];
    if (filterData.status !== undefined) {
      statuses = [filterData.status];
    }

    const totalCount = await this.findMethodsTechTaskUseCase.getCountByFilter({
      userId: user.id,
      statuses: statuses,
      posId: filterData.posId,
    });
    const techTasks = await this.findMethodsTechTaskUseCase.getAllByFilter({
      userId: user.id,
      statuses: statuses,
      posId: filterData.posId,
      skip: skip,
      take: take,
    });
    await Promise.all(
      techTasks.map(async (techTask) => {
        const techTags =
          await this.findMethodsTechTagUseCase.getAllByTechTaskId(techTask.id);
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
        });
      }),
    );

    return {
      techTaskReadAll: response,
      totalCount: totalCount,
    };
  }
}
