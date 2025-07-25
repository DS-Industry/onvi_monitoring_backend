import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { PrismaTechTaskMapper } from '@db/mapper/prisma-tech-task-mapper';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

@Injectable()
export class TechTaskRepository extends ITechTaskRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: TechTask): Promise<TechTask> {
    const techTaskEntity = PrismaTechTaskMapper.toPrisma(input);
    const techTask = await this.prisma.techTask.create({
      data: techTaskEntity,
    });
    return PrismaTechTaskMapper.toDomain(techTask);
  }

  public async findOneById(id: number): Promise<TechTask> {
    const techTask = await this.prisma.techTask.findFirst({
      where: {
        id,
      },
    });
    return PrismaTechTaskMapper.toDomain(techTask);
  }
  public async findAllByFilter(
    posId?: number,
    gteStartDate?: Date,
    lteStartDate?: Date,
    gteEndSpecifiedDate?: Date,
    lteEndSpecifiedDate?: Date,
    gteNextCreateDate?: Date,
    lteNextCreateDate?: Date,
    type?: TypeTechTask,
    statuses?: StatusTechTask[],
    codeTag?: string,
    skip?: number,
    take?: number,
  ): Promise<TechTask[]> {
    const where: any = {};

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (gteStartDate !== undefined && lteStartDate !== undefined) {
      where.startDate = {
        gte: gteStartDate,
        lte: lteStartDate,
      };
    }

    if (
      gteEndSpecifiedDate !== undefined &&
      lteEndSpecifiedDate !== undefined
    ) {
      where.endSpecifiedDate = {
        gte: gteEndSpecifiedDate,
        lte: lteEndSpecifiedDate,
      };
    }

    if (gteNextCreateDate !== undefined && lteNextCreateDate !== undefined) {
      where.nextCreateDate = {
        gte: gteNextCreateDate,
        lte: lteNextCreateDate,
      };
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (statuses !== undefined) {
      where.status = {
        in: statuses,
      };
    }

    if (codeTag !== undefined) {
      where.tags = {
        some: {
          code: codeTag,
        },
      };
    }

    const techTasks = await this.prisma.techTask.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async countAllByFilter(
    posId?: number,
    gteStartDate?: Date,
    lteStartDate?: Date,
    gteEndSpecifiedDate?: Date,
    lteEndSpecifiedDate?: Date,
    gteNextCreateDate?: Date,
    lteNextCreateDate?: Date,
    type?: TypeTechTask,
    statuses?: StatusTechTask[],
    codeTag?: string,
  ): Promise<number> {
    const where: any = {};

    if (posId !== undefined) {
      where.posId = posId;
    }

    if (gteStartDate !== undefined && lteStartDate !== undefined) {
      where.startDate = {
        gte: gteStartDate,
        lte: lteStartDate,
      };
    }

    if (
      gteEndSpecifiedDate !== undefined &&
      lteEndSpecifiedDate !== undefined
    ) {
      where.endSpecifiedDate = {
        gte: gteEndSpecifiedDate,
        lte: lteEndSpecifiedDate,
      };
    }

    if (gteNextCreateDate !== undefined && lteNextCreateDate !== undefined) {
      where.nextCreateDate = {
        gte: gteNextCreateDate,
        lte: lteNextCreateDate,
      };
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (statuses !== undefined) {
      where.status = {
        in: statuses,
      };
    }

    if (codeTag !== undefined) {
      where.tags = {
        some: {
          code: codeTag,
        },
      };
    }

    return this.prisma.techTask.count({
      where: where,
    });
  }

  public async findAllForUser(
    userId: number,
    statuses: StatusTechTask[],
    skip?: number,
    take?: number,
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        pos: {
          usersPermissions: {
            some: {
              id: userId,
            },
          },
        },
        status: {
          in: statuses,
        },
      },
      orderBy: {
        endSpecifiedDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async countAllForUser(
    userId: number,
    statuses: StatusTechTask[],
  ): Promise<number> {
    return await this.prisma.techTask.count({
      where: {
        pos: {
          usersPermissions: {
            some: {
              id: userId,
            },
          },
        },
        status: {
          in: statuses,
        },
      },
    });
  }

  public async update(input: TechTask): Promise<TechTask> {
    const techTaskEntity = PrismaTechTaskMapper.toPrisma(input);
    const techTask = await this.prisma.techTask.update({
      where: {
        id: input.id,
      },
      data: techTaskEntity,
    });
    return PrismaTechTaskMapper.toDomain(techTask);
  }

  public async updateConnectionTag(
    techTagId: number,
    addTagIds: number[],
    deleteTagIds: number[],
  ): Promise<any> {
    await this.prisma.techTask.update({
      where: {
        id: techTagId,
      },
      data: {
        tags: {
          disconnect: deleteTagIds.map((id) => ({ id })),
          connect: addTagIds.map((id) => ({ id })),
        },
      },
    });
  }
}
