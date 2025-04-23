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

  public async findAllByPosId(posId: number): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    status: StatusTechTask,
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId,
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: status,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByTypeAndPosIdAndDate(
    posId: number,
    type: TypeTechTask,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId,
        type,
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: StatusTechTask.FINISHED,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByTypeAndPosIdsAndDate(
    posIds: number[],
    type: TypeTechTask,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId: { in: posIds },
        type,
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: StatusTechTask.FINISHED,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllCodeTagAndPosIdsAndDate(
    posIds: number[],
    codeTag: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId: { in: posIds },
        tags: {
          some: {
            code: codeTag,
          },
        },
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: StatusTechTask.FINISHED,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByPosIdAndStatuses(
    posId: number,
    statuses: StatusTechTask[],
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId,
        status: { in: statuses },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByPosIdsAndStatuses(
    posIds: number[],
    statuses: StatusTechTask[],
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId: { in: posIds },
        status: { in: statuses },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllByStatus(status: StatusTechTask): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        status,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllForHandler(): Promise<TechTask[]> {
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const techTasks = await this.prisma.techTask.findMany({
      where: {
        nextCreateDate: {
          gte: todayUTC,
          lt: tomorrowUTC,
        },
        status: {
          not: StatusTechTask.PAUSE,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
  }

  public async findAllForOverdue(): Promise<TechTask[]> {
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const techTasks = await this.prisma.techTask.findMany({
      where: {
        endSpecifiedDate: {
          gte: todayUTC,
          lt: tomorrowUTC,
        },
        status: StatusTechTask.ACTIVE,
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return techTasks.map((item) => PrismaTechTaskMapper.toDomain(item));
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
