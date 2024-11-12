import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { PrismaService } from '@db/prisma/prisma.service';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { PrismaTechTaskMapper } from '@db/mapper/prisma-tech-task-mapper';
import { StatusTechTask, TypeTechTask } from "@prisma/client";

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
  ): Promise<TechTask[]> {
    const techTasks = await this.prisma.techTask.findMany({
      where: {
        posId,
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
}
