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
}
