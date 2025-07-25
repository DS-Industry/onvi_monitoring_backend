import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import {
  TechTaskReadAllResponse,
  TechTaskReadAllResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';

@Injectable()
export class ReportTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    posId: number,
    type?: TypeTechTask,
    skip?: number,
    take?: number,
  ): Promise<TechTaskReadAllResponseDto> {
    const response: TechTaskReadAllResponse[] = [];
    const totalCount = await this.findMethodsTechTaskUseCase.getCountByFilter({
      posId: posId,
      statuses: [StatusTechTask.FINISHED],
      type: type,
    });
    const techTasks = await this.findMethodsTechTaskUseCase.getAllByFilter({
      posId: posId,
      statuses: [StatusTechTask.FINISHED],
      type: type,
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
