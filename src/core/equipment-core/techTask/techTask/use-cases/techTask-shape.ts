import { Injectable } from '@nestjs/common';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import {
  TechTaskItemDto,
  TechTaskShapeResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-shape-response.dto';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { FindMethodsTechTagUseCase } from "@tech-task/tag/use-case/techTag-find-methods";

@Injectable()
export class ShapeTechTaskUseCase {
  constructor(
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(techTask: TechTask): Promise<TechTaskShapeResponseDto> {
    const items: TechTaskItemDto[] = [];
    const itemsValueToTechTask =
      await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
        techTask.id,
      );
    await Promise.all(
      itemsValueToTechTask.map(async (itemValue) => {
        const itemTechTask = await this.findMethodsItemTemplateUseCase.getById(
          itemValue.techTaskItemTemplateId,
        );
        items.push({
          id: itemValue.id,
          title: itemTechTask.title,
          type: itemTechTask.type,
          group: itemTechTask.group,
          code: itemTechTask.code,
          value: itemValue.value,
          image: itemValue.image,
        });
      }),
    );
    if (!techTask.startWorkDate) {
      techTask.startWorkDate = new Date();
      await this.techTaskRepository.update(techTask);
    }
    const techTags = await this.findMethodsTechTagUseCase.getAllByTechTaskId(
      techTask.id,
    );
    return {
      id: techTask.id,
      name: techTask.name,
      posId: techTask.posId,
      type: techTask.type,
      status: techTask.status,
      endSpecifiedDate: techTask?.endSpecifiedDate,
      period: techTask?.period,
      markdownDescription: techTask?.markdownDescription,
      startWorkDate: techTask?.startWorkDate,
      sendWorkDate: techTask?.sendWorkDate,
      executorId: techTask?.executorId,
      items: items,
      tags: techTags.map((tag) => tag.getProps()),
    };
  }
}
