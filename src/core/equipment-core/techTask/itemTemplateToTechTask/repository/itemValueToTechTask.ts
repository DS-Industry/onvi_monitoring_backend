import { Injectable } from '@nestjs/common';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';
import { PrismaTechTaskItemValueToTechTaskMapper } from '@db/mapper/prisma-tech-task-item-value-to-tech-task-mapper';

@Injectable()
export class TechTaskItemValueToTechTaskRepository extends ITechTaskItemValueToTechTaskRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: TechTaskItemValueToTechTask,
  ): Promise<TechTaskItemValueToTechTask> {
    const itemValueToTechTaskEntity =
      PrismaTechTaskItemValueToTechTaskMapper.toPrisma(input);
    const itemValueToTechTask =
      await this.prisma.techTaskItemValueToTechTask.create({
        data: itemValueToTechTaskEntity,
      });
    return PrismaTechTaskItemValueToTechTaskMapper.toDomain(
      itemValueToTechTask,
    );
  }

  public async createMany(input: TechTaskItemValueToTechTask[]): Promise<void> {
    const itemValueToTechTaskEntities = input.map((item) =>
      PrismaTechTaskItemValueToTechTaskMapper.toPrisma(item),
    );

    await this.prisma.techTaskItemValueToTechTask.createMany({
      data: itemValueToTechTaskEntities,
    });
  }

  public async deleteMany(
    techTaskId: number,
    techTaskItemTemplateIds: number[],
  ): Promise<void> {
    await this.prisma.techTaskItemValueToTechTask.deleteMany({
      where: {
        techTaskId,
        techTaskItemTemplateId: { in: techTaskItemTemplateIds },
      },
    });
  }

  public async findAllByTaskId(
    techTaskId: number,
  ): Promise<TechTaskItemValueToTechTask[]> {
    const itemValueToTechTasks =
      await this.prisma.techTaskItemValueToTechTask.findMany({
        where: {
          techTaskId,
        },
      });
    return itemValueToTechTasks.map((item) =>
      PrismaTechTaskItemValueToTechTaskMapper.toDomain(item),
    );
  }

  public async updateValue(
    id: number,
    value: string,
  ): Promise<TechTaskItemValueToTechTask> {
    const itemValueToTechTask =
      await this.prisma.techTaskItemValueToTechTask.update({
        where: {
          id,
        },
        data: { value: value },
      });
    return PrismaTechTaskItemValueToTechTaskMapper.toDomain(
      itemValueToTechTask,
    );
  }
}
