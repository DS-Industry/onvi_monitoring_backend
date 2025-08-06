import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskCreateDto } from '@tech-task/techTask/use-cases/dto/techTask-create.dto';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { TechTaskResponseDto } from '@platform-user/core-controller/dto/response/techTask-response.dto';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';

@Injectable()
export class CreateTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    input: TechTaskCreateDto,
    userId: number,
  ): Promise<TechTaskResponseDto> {
    let nextCreateDate: Date | undefined;
    let endSpecifiedDate: Date | undefined;

    if (input.type === TypeTechTask.REGULAR) {
      nextCreateDate = new Date(input.startDate);
      nextCreateDate.setDate(nextCreateDate.getDate() + input.period);
      endSpecifiedDate = nextCreateDate;
    } else if (input.type === TypeTechTask.ONETIME) {
      endSpecifiedDate = input.endSpecifiedDate;
    }

    const techTaskData = new TechTask({
      name: input.name,
      posId: input.posId,
      type: input.type,
      status: StatusTechTask.ACTIVE,
      period: input?.period,
      markdownDescription: input?.markdownDescription,
      nextCreateDate: nextCreateDate,
      endSpecifiedDate: endSpecifiedDate,
      startDate: input.startDate,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: userId,
      updatedById: userId,
    });
    const techTask = await this.techTaskRepository.create(techTaskData);
    await this.techTaskRepository.updateConnectionTag(
      techTask.id,
      input.tagIds,
      [],
    );

    const itemValueToTechTask: TechTaskItemValueToTechTask[] = [];

    for (const item of input.techTaskItem) {
      itemValueToTechTask.push(
        new TechTaskItemValueToTechTask({
          techTaskId: techTask.id,
          techTaskItemTemplateId: item,
        }),
      );
    }
    this.techTaskItemValueToTechTaskRepository.createMany(itemValueToTechTask);
    const techTags = await this.findMethodsTechTagUseCase.getAllByTechTaskId(
      techTask.id,
    );
    return {
      id: techTask.id,
      name: techTask.name,
      posId: techTask.posId,
      type: techTask.type,
      status: techTask.status,
      period: techTask?.period,
      markdownDescription: techTask?.markdownDescription,
      nextCreateDate: techTask?.nextCreateDate,
      endSpecifiedDate: techTask?.endSpecifiedDate,
      startDate: techTask.startDate,
      startWorkDate: techTask?.startWorkDate,
      sendWorkDate: techTask?.sendWorkDate,
      executorId: techTask?.executorId,
      createdAt: techTask?.createdAt,
      updatedAt: techTask?.updatedAt,
      createdById: techTask.createdById,
      updatedById: techTask.updatedById,
      tags: techTags.map((tag) => tag.getProps()),
    };
  }
}
