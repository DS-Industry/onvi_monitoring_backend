import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { TechTaskReadAllResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { StatusTechTask } from '@prisma/client';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class ReadAllByPosTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
  ) {}

  async execute(posIds: number[]): Promise<TechTaskReadAllResponseDto[]> {
    const response: TechTaskReadAllResponseDto[] = [];
    const techTasks =
      await this.findMethodsTechTaskUseCase.getAllByPosIdsAndStatuses(posIds, [
        StatusTechTask.ACTIVE,
        StatusTechTask.OVERDUE,
        StatusTechTask.FINISHED,
      ]);
    await Promise.all(
      techTasks.map(async (techTask) => {
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
        });
      }),
    );

    return response;
  }
}
