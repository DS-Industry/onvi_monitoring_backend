import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { TechTaskShapeResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { StatusTechTask } from '@prisma/client';

@Injectable()
export class ReadAllByPosTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
  ) {}

  async execute(posId: number): Promise<TechTaskShapeResponseDto[]> {
    const response: TechTaskShapeResponseDto[] = [];
    const techTasks =
      await this.findMethodsTechTaskUseCase.getAllByPosIdAndStatuses(posId, [
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
