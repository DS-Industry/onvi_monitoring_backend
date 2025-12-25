import { Injectable } from '@nestjs/common';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import {
  TechTaskItemDto,
  TechTaskShapeResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-shape-response.dto';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { TechTaskItemValueToTechTask } from "@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask";
import { TechTaskItemTemplate } from "@tech-task/itemTemplate/domain/itemTemplate";

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
    const [itemsValueToTechTask, techTags] = await Promise.all([
      this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
        techTask.id,
      ),
      this.findMethodsTechTagUseCase.getAllByTechTaskId(techTask.id),
    ]);
    const sortedItemsValueToTechTask = itemsValueToTechTask.sort(
      (a, b) => a.techTaskItemTemplateId - b.techTaskItemTemplateId,
    );

    const templateIds = [
      ...new Set(
        itemsValueToTechTask.map(i => i.techTaskItemTemplateId)
      ),
    ];

    const templates = await this.findMethodsItemTemplateUseCase.getByIds(templateIds);

    const templateMap = new Map(
      templates.map(t => [t.id, t]),
    );


    for (const itemValue of sortedItemsValueToTechTask) {
      const template = templateMap.get(itemValue.techTaskItemTemplateId);
      if (!template) continue;

      items.push({
        id: itemValue.id,
        title: template.title,
        type: template.type,
        group: template.group,
        code: template.code,
        value: itemValue.value,
        image: itemValue.image,
      });
    }

    if (!techTask.sendWorkDate) {
      techTask.sendWorkDate = new Date();
      await this.techTaskRepository.update(techTask);
    }
    return {
      id: techTask.id,
      name: techTask.name,
      posId: techTask.posId,
      type: techTask.type,
      status: techTask.status,
      endSpecifiedDate: techTask?.endSpecifiedDate,
      periodType: techTask?.periodType,
      customPeriodDays: techTask?.customPeriodDays,
      markdownDescription: techTask?.markdownDescription,
      startWorkDate: techTask?.startWorkDate,
      sendWorkDate: techTask?.sendWorkDate,
      executorId: techTask?.executorId,
      items: items,
      tags: techTags.map((tag) => tag.getProps()),
      createdBy: techTask?.createdBy || undefined,
      executor: techTask?.executor || undefined,
    };
  }

  async executeBatch(
    techTasks: TechTask[],
  ): Promise<Map<number, TechTaskShapeResponseDto>> {
    const techTaskIds = techTasks.map(t => t.id);

    const allItemsValues = await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskIds(techTaskIds);

    const templateIds = [
      ...new Set(allItemsValues.map((i) => i.techTaskItemTemplateId)),
    ];
    const templates = await this.findMethodsItemTemplateUseCase.getByIds(templateIds);

    const templateMap = new Map<number, TechTaskItemTemplate>();
    templates.forEach((t) => templateMap.set(t.id, t));

    const itemsValuesByTaskId = allItemsValues.reduce((acc, itemValue) => {
      if (!acc[itemValue.techTaskId]) {
        acc[itemValue.techTaskId] = [];
      }
      acc[itemValue.techTaskId].push(itemValue);
      return acc;
    }, {} as Record<number, TechTaskItemValueToTechTask[]>);

    const result = new Map<number, TechTaskShapeResponseDto>();

    for (const techTask of techTasks) {
      const items: TechTaskItemDto[] = [];

      const valuesForTask = itemsValuesByTaskId[techTask.id] || [];

      for (const itemValue of valuesForTask) {
        const template = templateMap.get(itemValue.techTaskItemTemplateId);
        if (!template) continue;

        items.push({
          id: itemValue.id,
          title: template.title,
          type: template.type,
          group: template.group,
          code: template.code,
          value: itemValue.value,
          image: itemValue.image,
        });
      }

      const techTaskDto: TechTaskShapeResponseDto = {
        id: techTask.id,
        name: techTask.name,
        posId: techTask.posId,
        type: techTask.type,
        status: techTask.status,
        endSpecifiedDate: techTask?.endSpecifiedDate,
        periodType: techTask?.periodType,
        customPeriodDays: techTask?.customPeriodDays,
        markdownDescription: techTask?.markdownDescription,
        startWorkDate: techTask?.startWorkDate,
        sendWorkDate: techTask?.sendWorkDate || new Date(),
        executorId: techTask?.executorId,
        items,
        tags: techTask.tags.map((tag) => tag.getProps()),
        createdBy: techTask?.createdBy || undefined,
        executor: techTask?.executor || undefined,
      };

      result.set(techTask.id, techTaskDto);
    }

    return result;
  }
}
