import { Injectable } from '@nestjs/common';
import { IManagerReportPeriodRepository } from '@manager-paper/managerReportPeriod/interface/managerReportPeriod';
import { PrismaService } from '@db/prisma/prisma.service';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { ManagerReportPeriodStatus } from '@prisma/client';
import { PrismaManagerReportPeriodMapper } from '@db/mapper/prisma-manager-report-period-mapper';

@Injectable()
export class ManagerReportPeriodRepository extends IManagerReportPeriodRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: ManagerReportPeriod,
  ): Promise<ManagerReportPeriod> {
    const managerPaperPeriodPrismaEntity =
      PrismaManagerReportPeriodMapper.toPrisma(input);
    const managerPaperPeriod = await this.prisma.managerReportPeriod.create({
      data: managerPaperPeriodPrismaEntity,
    });
    return PrismaManagerReportPeriodMapper.toDomain(managerPaperPeriod);
  }

  public async findOneById(id: number): Promise<ManagerReportPeriod> {
    const managerPaperPeriod = await this.prisma.managerReportPeriod.findFirst({
      where: { id },
    });
    return PrismaManagerReportPeriodMapper.toDomain(managerPaperPeriod);
  }

  public async findAllByFilter(
    status?: ManagerReportPeriodStatus,
    dateStartPeriod?: Date,
    dateEndPeriod?: Date,
    userId?: number,
    skip?: number,
    take?: number,
  ): Promise<ManagerReportPeriod[]> {
    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (dateStartPeriod !== undefined && dateEndPeriod !== undefined) {
      where.startPeriod = {
        gte: dateStartPeriod,
        lte: dateEndPeriod,
      };
    }

    const managerPapersPeriods = await this.prisma.managerReportPeriod.findMany(
      {
        skip: skip ?? undefined,
        take: take ?? undefined,
        where,
        orderBy: {
          startPeriod: 'asc',
        },
      },
    );
    return managerPapersPeriods.map((item) =>
      PrismaManagerReportPeriodMapper.toDomain(item),
    );
  }

  public async countAllByFilter(
    status?: ManagerReportPeriodStatus,
    dateStartPeriod?: Date,
    dateEndPeriod?: Date,
    userId?: number,
  ): Promise<number> {
    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    if (dateStartPeriod !== undefined && dateEndPeriod !== undefined) {
      where.startPeriod = {
        gte: dateStartPeriod,
        lte: dateEndPeriod,
      };
    }

    return this.prisma.managerReportPeriod.count({ where });
  }

  public async update(
    input: ManagerReportPeriod,
  ): Promise<ManagerReportPeriod> {
    const managerPaperPeriodPrismaEntity =
      PrismaManagerReportPeriodMapper.toPrisma(input);
    const managerPaperPeriod = await this.prisma.managerReportPeriod.update({
      where: {
        id: input.id,
      },
      data: managerPaperPeriodPrismaEntity,
    });
    return PrismaManagerReportPeriodMapper.toDomain(managerPaperPeriod);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.managerReportPeriod.delete({ where: { id } });
  }

  public async findByDateAndUser(
    eventDate: Date,
    userId: number,
  ): Promise<ManagerReportPeriod | null> {
    const managerReportPeriod = await this.prisma.managerReportPeriod.findFirst(
      {
        where: {
          userId,
          startPeriod: {
            lte: eventDate,
          },
          endPeriod: {
            gte: eventDate,
          },
        },
      },
    );

    if (!managerReportPeriod) {
      return null;
    }

    return PrismaManagerReportPeriodMapper.toDomain(managerReportPeriod);
  }
}
