import { Injectable } from "@nestjs/common";
import { ITechExpenseReportRepository } from "@tech-report/techExpenseReport/interface/techExpenseReport";
import { PrismaService } from "@db/prisma/prisma.service";
import { TechExpenseReport } from "@tech-report/techExpenseReport/domain/techExpenseReport";
import { PrismaTechExpenseReportMapper } from "@db/mapper/prisma-tech-expense-report-mapper";
import { TechExpenseReportStatus } from "@prisma/client";

@Injectable()
export class TechExpenseReportReport extends ITechExpenseReportRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: TechExpenseReport): Promise<TechExpenseReport> {
    const techExpenseReportEntity = PrismaTechExpenseReportMapper.toPrisma(input);
    const techExpenseReport = await this.prisma.techExpenseReport.create({
      data: techExpenseReportEntity,
    })
    return PrismaTechExpenseReportMapper.toDomain(techExpenseReport);
  }

  public async findOneById(id: number): Promise<TechExpenseReport> {
    const techExpenseReport = await this.prisma.techExpenseReport.findFirst({
      where: {
        id,
      }
    });
    return PrismaTechExpenseReportMapper.toDomain(techExpenseReport);
  }

  public async findAllByFilter(
    userId?: number,
    posId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    status?: TechExpenseReportStatus,
    skip?: number,
    take?: number,
  ): Promise<TechExpenseReport[]> {
    const where: any = {};

    if (posId !== undefined) {
      where.posId = posId;
    } else {
      where.pos = {
        ...where.pos,
        usersPermissions: {
          some: {
            id: userId,
          },
        },
      };
    }

    if (dateStart !== undefined && dateEnd !== undefined) {
      where.startPeriod = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (status !== undefined) {
      where.status = status;
    }

    const techExpenseReports = await this.prisma.techExpenseReport.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        startPeriod: 'asc',
      },
    });
    return techExpenseReports.map((item) =>
      PrismaTechExpenseReportMapper.toDomain(item),
    );
  }
}