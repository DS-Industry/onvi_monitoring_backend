import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask } from '@prisma/client';
import {
  TechTaskItemDto,
  TechTaskManageInfoResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-manage-info-response.dto';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';

@Injectable()
export class ManageAllByPosAndStatusesTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    posIds: number[],
    statuses: StatusTechTask[],
  ): Promise<TechTaskManageInfoResponseDto[]> {
    const response: TechTaskManageInfoResponseDto[] = [];
    const techTasks =
      await this.findMethodsTechTaskUseCase.getAllByPosIdsAndStatuses(
        posIds,
        statuses,
      );
    await Promise.all(
      techTasks.map(async (techTask) => {
        const items: TechTaskItemDto[] = [];
        const itemsValueToTechTask =
          await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
            techTask.id,
          );
        await Promise.all(
          itemsValueToTechTask.map(async (item) => {
            const itemTechTask =
              await this.findMethodsItemTemplateUseCase.getById(
                item.techTaskItemTemplateId,
              );
            items.push({ id: itemTechTask.id, title: itemTechTask.title });
          }),
        );
        const techTags =
          await this.findMethodsTechTagUseCase.getAllByTechTaskId(techTask.id);

        response.push({
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
          items: items,
          createdAt: techTask.createdAt,
          createdById: techTask.createdById,
          updatedAt: techTask.updatedAt,
          updatedById: techTask.updatedById,
          tags: techTags.map((tag) => tag.getProps()),
        });
      }),
    );
    return response;
  }
}
