import { Injectable } from '@nestjs/common';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { StatusTechTask } from '@prisma/client';
import {
  TechTaskItemDto,
  TechTaskManageInfoResponse,
  TechTaskManageInfoResponseDto,
} from '@tech-task/techTask/use-cases/dto/techTask-manage-info-response.dto';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { User } from '@platform-user/user/domain/user';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';

@Injectable()
export class ManageAllByPosAndStatusesTechTaskUseCase {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
  ) {}

  async execute(
    user: User,
    posId?: number,
    skip?: number,
    take?: number,
  ): Promise<TechTaskManageInfoResponseDto> {
    const [totalCount, techTasks] = await Promise.all([
      this.findMethodsTechTaskUseCase.getCountByFilter({
        posId,
        userId: user.id,
        statuses: [StatusTechTask.ACTIVE],
      }),
      this.findMethodsTechTaskUseCase.getAllByFilter({
        posId,
        userId: user.id,
        statuses: [StatusTechTask.ACTIVE],
        skip,
        take,
      }),
    ]);

    const response = await this.collectTechTaskDetails(techTasks);

    return {
      techTaskManageInfo: response,
      totalCount,
    };
  }

  private async collectTechTaskDetails(
    techTasks: TechTask[],
  ): Promise<TechTaskManageInfoResponse[]> {
    const response: TechTaskManageInfoResponse[] = [];

    for (const techTask of techTasks) {
      const [itemsValueToTechTask, techTags] = await Promise.all([
        this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
          techTask.id,
        ),
        this.findMethodsTechTagUseCase.getAllByTechTaskId(techTask.id),
      ]);

      const items = await this.getTechTaskItems(itemsValueToTechTask);

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
        items,
        createdAt: techTask.createdAt,
        createdById: techTask.createdById,
        updatedAt: techTask.updatedAt,
        updatedById: techTask.updatedById,
        tags: techTags.map((tag) => tag.getProps()),
      });
    }

    return response;
  }

  private async getTechTaskItems(
    itemsValueToTechTask: TechTaskItemValueToTechTask[],
  ): Promise<TechTaskItemDto[]> {
    const items: TechTaskItemDto[] = [];

    for (const item of itemsValueToTechTask) {
      const itemTechTask = await this.findMethodsItemTemplateUseCase.getById(
        item.techTaskItemTemplateId,
      );
      items.push({
        id: itemTechTask.id,
        title: itemTechTask.title,
      });
    }

    return items;
  }
}
