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
      include: {
        tags: true,
        pos: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            surname: true,
            id: true
          },
        },
      },
    });
    return PrismaTechTaskMapper.toDomain(techTask);
  }

  public async findOneById(id: number): Promise<TechTask> {
    const techTask = await this.prisma.techTask.findFirst({
      where: {
        id,
      },
      include: {
        tags: true,
        pos: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            surname: true,
            id: true
          },
        },
      },
    });
    return PrismaTechTaskMapper.toDomain(techTask);
  }
  public async findAllByFilter(
    posId?: number,
    userId?: number,
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
    organizationId?: number,
    name?: string,
    tags?: string[],
    authorId?: number,
    executorId?: number,
  ): Promise<TechTask[]> {
    const where: any = {};

    if (posId !== undefined) {
      where.posId = posId;
    } else if (organizationId !== undefined) {
      where.pos = {
        organizationId: organizationId,
      };
    } else {
      where.pos = {
        usersPermissions: {
          some: {
            id: userId,
          },
        },
      };
    }

    if (gteStartDate !== undefined || lteStartDate !== undefined) {
      where.startDate = {};
      if (gteStartDate !== undefined) {
        where.startDate.gte = gteStartDate;
      }
      if (lteStartDate !== undefined) {
        where.startDate.lte = lteStartDate;
      }
    }

    if (gteEndSpecifiedDate !== undefined || lteEndSpecifiedDate !== undefined) {
      where.endSpecifiedDate = {};
      if (gteEndSpecifiedDate !== undefined) {
        where.endSpecifiedDate.gte = gteEndSpecifiedDate;
      }
      if (lteEndSpecifiedDate !== undefined) {
        where.endSpecifiedDate.lte = lteEndSpecifiedDate;
      }
    }

    if (gteNextCreateDate !== undefined || lteNextCreateDate !== undefined) {
      where.nextCreateDate = {};
      if (gteNextCreateDate !== undefined) {
        where.nextCreateDate.gte = gteNextCreateDate;
      }
      if (lteNextCreateDate !== undefined) {
        where.nextCreateDate.lte = lteNextCreateDate;
      }
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (statuses !== undefined) {
      where.status = {
        in: statuses,
      };
    }

    if (name !== undefined) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (tags !== undefined && tags.length > 0) {
      where.tags = {
        some: {
          OR: tags.map(tag => ({
            OR: [
              { name: { contains: tag, mode: 'insensitive' } },
              { code: { contains: tag, mode: 'insensitive' } }
            ]
          }))
        },
      };
    } else if (codeTag !== undefined) {
      where.tags = {
        some: {
          code: codeTag,
        },
      };
    }

    if (authorId !== undefined) {
      where.createdById = authorId;
    }

    if (executorId !== undefined) {
      where.executorId = executorId;
    }

    const techTasks = await this.prisma.techTask.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: where,
      orderBy: {
        endSpecifiedDate: 'desc',
      },
      include:{
        tags: true,
        pos: true,
        createdBy: {
          select: {
            name: true,
            surname: true,
            id: true
          },
        },
        executor: {
          select: {
            name: true,
            surname: true,
            id: true
          },
        },
      }
    });

    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async countAllByFilter(
    posId?: number,
    userId?: number,
    gteStartDate?: Date,
    lteStartDate?: Date,
    gteEndSpecifiedDate?: Date,
    lteEndSpecifiedDate?: Date,
    gteNextCreateDate?: Date,
    lteNextCreateDate?: Date,
    type?: TypeTechTask,
    statuses?: StatusTechTask[],
    codeTag?: string,
    organizationId?: number,
    name?: string,
    tags?: string[],
    authorId?: number,
    executorId?: number,
  ): Promise<number> {
    const where: any = {};

    if (posId !== undefined) {
      where.posId = posId;
    } else if (organizationId !== undefined) {
      where.pos = {
        organizationId: organizationId,
      };
    } else {
      where.pos = {
        usersPermissions: {
          some: {
            id: userId,
          },
        },
      };
    }

    if (gteStartDate !== undefined || lteStartDate !== undefined) {
      where.startDate = {};
      if (gteStartDate !== undefined) {
        where.startDate.gte = gteStartDate;
      }
      if (lteStartDate !== undefined) {
        where.startDate.lte = lteStartDate;
      }
    }

    if (gteEndSpecifiedDate !== undefined || lteEndSpecifiedDate !== undefined) {
      where.endSpecifiedDate = {};
      if (gteEndSpecifiedDate !== undefined) {
        where.endSpecifiedDate.gte = gteEndSpecifiedDate;
      }
      if (lteEndSpecifiedDate !== undefined) {
        where.endSpecifiedDate.lte = lteEndSpecifiedDate;
      }
    }

    if (gteNextCreateDate !== undefined || lteNextCreateDate !== undefined) {
      where.nextCreateDate = {};
      if (gteNextCreateDate !== undefined) {
        where.nextCreateDate.gte = gteNextCreateDate;
      }
      if (lteNextCreateDate !== undefined) {
        where.nextCreateDate.lte = lteNextCreateDate;
      }
    }

    if (type !== undefined) {
      where.type = type;
    }

    if (statuses !== undefined) {
      where.status = {
        in: statuses,
      };
    }

    if (name !== undefined) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    // Handle tag filtering - prioritize new tags array over legacy codeTag
    if (tags !== undefined && tags.length > 0) {
      where.tags = {
        some: {
          OR: tags.map(tag => ({
            OR: [
              { name: { contains: tag, mode: 'insensitive' } },
              { code: { contains: tag, mode: 'insensitive' } }
            ]
          }))
        },
      };
    } else if (codeTag !== undefined) {
      where.tags = {
        some: {
          code: codeTag,
        },
      };
    }

    if (authorId !== undefined) {
      where.createdById = authorId;
    }

    if (executorId !== undefined) {
      where.executorId = executorId;
    }

    return this.prisma.techTask.count({
      where: where,
    });
  }

  public async update(input: TechTask): Promise<TechTask> {
    const techTaskEntity = PrismaTechTaskMapper.toPrisma(input);
    const techTask = await this.prisma.techTask.update({
      where: {
        id: input.id,
      },
      data: techTaskEntity,
      include: {
        tags: true,
      },
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

  public async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.techTaskItemValueToTechTask.deleteMany({
        where: {
          techTaskId: id,
        },
      });

      await prisma.techTask.delete({
        where: {
          id: id,
        },
      });
    });
  }

  public async deleteMany(ids: number[]): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.techTaskItemValueToTechTask.deleteMany({
        where: {
          techTaskId: {
            in: ids,
          },
        },
      });

      await prisma.techTask.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    });
  }

  public async findManyByIds(ids: number[], posId?: number, organizationId?: number): Promise<TechTask[]> {
    const where: any = {
      id: {
        in: ids,
      },
    };

    if (posId !== undefined) {
      where.posId = posId;
    } else if (organizationId !== undefined) {
      where.pos = {
        organizationId: organizationId,
      };
    }

    const techTasks = await this.prisma.techTask.findMany({
      where: where,
      include: {
        tags: true,
      },
    });

    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }
}
