import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskCreateDto } from '@tech-task/techTask/use-cases/dto/techTask-create.dto';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { TechTaskResponseDto } from '@platform-user/core-controller/dto/response/techTask-response.dto';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { PeriodCalculator } from '../utils/period-calculator';

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
      if (!input.periodType) {
        throw new Error('periodType is required for REGULAR tasks');
      }
      PeriodCalculator.validatePeriodConfig(input.periodType, input.customPeriodDays);
      nextCreateDate = PeriodCalculator.calculateNextDate(input.startDate, input.periodType, input.customPeriodDays);
      endSpecifiedDate = input.endSpecifiedDate || nextCreateDate;
    } else if (input.type === TypeTechTask.ONETIME) {
      endSpecifiedDate = input.endSpecifiedDate;
    }

    const techTaskData = new TechTask({
      name: input.name,
      posId: input.posId,
      type: input.type,
      status: StatusTechTask.ACTIVE,
      periodType: input?.periodType,
      customPeriodDays: input?.customPeriodDays,
      markdownDescription: input?.markdownDescription,
      nextCreateDate: nextCreateDate,
      endSpecifiedDate: endSpecifiedDate,
      startDate: input.startDate,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: userId,
      updatedById: userId,
      tags: [],
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
      periodType: techTask?.periodType,
      customPeriodDays: techTask?.customPeriodDays,
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
