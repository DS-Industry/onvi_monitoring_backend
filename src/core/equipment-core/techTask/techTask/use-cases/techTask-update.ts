import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTaskUpdateDto } from '@tech-task/techTask/use-cases/dto/techTask-update.dto';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { User } from '@platform-user/user/domain/user';
import { StatusTechTask } from '@prisma/client';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { TechTaskResponseDto } from '@platform-user/core-controller/dto/response/techTask-response.dto';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';

@Injectable()
export class UpdateTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    input: TechTaskUpdateDto,
    oldTechTask: TechTask,
    user?: User,
  ): Promise<TechTaskResponseDto> {
    const {
      name,
      type,
      status,
      period,
      markdownDescription,
      endSpecifiedDate,
    } = input;

    oldTechTask.name = name ? name : oldTechTask.name;
    oldTechTask.type = type ? type : oldTechTask.type;
    oldTechTask.status = status ? status : oldTechTask.status;
    oldTechTask.period = period ? period : oldTechTask.period;
    oldTechTask.markdownDescription = markdownDescription
      ? markdownDescription
      : oldTechTask.markdownDescription;
    oldTechTask.endSpecifiedDate = endSpecifiedDate
      ? endSpecifiedDate
      : oldTechTask.endSpecifiedDate;
    oldTechTask.updatedAt = new Date(Date.now());

    if (status && status == StatusTechTask.PAUSE) {
      oldTechTask.nextCreateDate = null;
    }

    if (user) {
      oldTechTask.updatedById = user.id;
    }

    if (input.techTaskItem) {
      const itemToTechTask =
        await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
          oldTechTask.id,
        );
      const oldItems = itemToTechTask.map(
        (item) => item.techTaskItemTemplateId,
      );
      const newItems = input.techTaskItem;

      const deleteItems = oldItems.filter((item) => !newItems.includes(item));
      const createItems = newItems.filter((item) => !oldItems.includes(item));

      if (deleteItems.length > 0) {
        this.techTaskItemValueToTechTaskRepository.deleteMany(
          oldTechTask.id,
          deleteItems,
        );
      }
      if (createItems.length > 0) {
        const itemValueToTechTask: TechTaskItemValueToTechTask[] = [];

        await Promise.all(
          createItems.map(async (item) => {
            itemValueToTechTask.push(
              new TechTaskItemValueToTechTask({
                techTaskId: oldTechTask.id,
                techTaskItemTemplateId: item,
              }),
            );
          }),
        );
        this.techTaskItemValueToTechTaskRepository.createMany(
          itemValueToTechTask,
        );
      }
    }

    const techTask = await this.techTaskRepository.update(oldTechTask);
    let techTags = await this.findMethodsTechTagUseCase.getAllByTechTaskId(
      techTask.id,
    );
    if (input.tagIds) {
      const existingTagIds = techTags.map((tag) => tag.id);

      const deleteTagIds = existingTagIds.filter(
        (id) => !input.tagIds.includes(id),
      );
      const addTagIds = input.tagIds.filter(
        (id) => !existingTagIds.includes(id),
      );
      await this.techTaskRepository.updateConnectionTag(
        techTask.id,
        addTagIds,
        deleteTagIds,
      );

      techTags = await this.findMethodsTechTagUseCase.getAllByTechTaskId(
        techTask.id,
      );
    }

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
