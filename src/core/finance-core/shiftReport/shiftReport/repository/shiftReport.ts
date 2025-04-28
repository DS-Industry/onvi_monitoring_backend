import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { PrismaService } from '@db/prisma/prisma.service';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { PrismaShiftReportMapper } from '@db/mapper/prisma-shift-report-mapper';
import { User } from '@platform-user/user/domain/user';
import { PrismaPlatformUserMapper } from '@db/mapper/prisma-platform-user-mapper';

@Injectable()
export class ShiftReportRepository extends IShiftReportRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ShiftReport): Promise<ShiftReport> {
    const shiftReportEntity = PrismaShiftReportMapper.toPrisma(input);
    const shiftReport = await this.prisma.shiftReport.create({
      data: shiftReportEntity,
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findOneById(id: number): Promise<ShiftReport> {
    const shiftReport = await this.prisma.shiftReport.findFirst({
      where: {
        id,
      },
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async addWorker(id: number, userId: number): Promise<ShiftReport> {
    const shiftReport = await this.prisma.shiftReport.update({
      where: { id },
      data: {
        users: {
          connect: { id: userId },
        },
        updatedAt: new Date(Date.now()),
      },
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findAllWorkerById(id: number): Promise<User[]> {
    const shiftReport = await this.prisma.shiftReport.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    const users = shiftReport?.users || [];
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }
  public async update(input: ShiftReport): Promise<ShiftReport> {
    const shiftReportEntity = PrismaShiftReportMapper.toPrisma(input);
    const shiftReport = await this.prisma.shiftReport.update({
      where: {
        id: input.id,
      },
      data: shiftReportEntity,
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }

  public async findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<ShiftReport[]> {
    const shiftReports = await this.prisma.shiftReport.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        posId,
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return shiftReports.map((item) =>
      PrismaShiftReportMapper.toDomain(item),
    );
  }

  public async findAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<ShiftReport[]> {
    const shiftReports = await this.prisma.shiftReport.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where: {
        posId: { in: posIds },
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return shiftReports.map((item) =>
      PrismaShiftReportMapper.toDomain(item),
    );
  }

  public async countAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.shiftReport.count({
      where: {
        posId,
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
  }

  public async countAllByPosIdsAndDate(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.shiftReport.count({
      where: {
        posId: { in: posIds },
        startDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
  }
}
