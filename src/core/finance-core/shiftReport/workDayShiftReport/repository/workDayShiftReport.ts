import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';
import { PrismaService } from '@db/prisma/prisma.service';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { PrismaWorkDayShiftReportMapper } from '@db/mapper/prisma-work-day-shift-report-mapper';
import { StatusWorkDayShiftReport } from '@prisma/client';

@Injectable()
export class WorkDayShiftReportRepository extends IWorkDayShiftReportRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: WorkDayShiftReport): Promise<WorkDayShiftReport> {
    const workDayShiftReportEntity =
      PrismaWorkDayShiftReportMapper.toPrisma(input);
    const workDayShiftReport = await this.prisma.workDayShiftReport.create({
      data: workDayShiftReportEntity,
    });
    return PrismaWorkDayShiftReportMapper.toDomain(workDayShiftReport);
  }
  public async findOneById(id: number): Promise<WorkDayShiftReport> {
    const workDayShiftReport = await this.prisma.workDayShiftReport.findFirst({
      where: { id },
    });
    return PrismaWorkDayShiftReportMapper.toDomain(workDayShiftReport);
  }
  public async findAllByShiftReportId(
    shiftReportId: number,
  ): Promise<WorkDayShiftReport[]> {
    const workDayShiftReports = await this.prisma.workDayShiftReport.findMany({
      where: {
        shiftReportId,
      },
    });
    return workDayShiftReports.map((item) =>
      PrismaWorkDayShiftReportMapper.toDomain(item),
    );
  }
  public async findOneByShiftIdAndWorkerIdAndDate(
    shiftReportId: number,
    workerId: number,
    workDate: Date,
  ): Promise<WorkDayShiftReport> {
    const workDayShiftReport = await this.prisma.workDayShiftReport.findFirst({
      where: {
        shiftReportId,
        workerId,
        workDate,
      },
    });
    return PrismaWorkDayShiftReportMapper.toDomain(workDayShiftReport);
  }
  public async findLastByStatusSentAndPosId(
    posId: number,
    workDate: Date,
  ): Promise<WorkDayShiftReport> {
    const workDayShiftReport = await this.prisma.workDayShiftReport.findFirst({
      where: {
        shiftReport: {
          posId,
        },
        status: StatusWorkDayShiftReport.SENT,
        workDate: {
          lt: workDate,
        },
      },
      orderBy: {
        workDate: 'desc',
      },
    });
    return PrismaWorkDayShiftReportMapper.toDomain(workDayShiftReport);
  }
  public async update(input: WorkDayShiftReport): Promise<WorkDayShiftReport> {
    const workDayShiftReportEntity =
      PrismaWorkDayShiftReportMapper.toPrisma(input);
    const workDayShiftReport = await this.prisma.workDayShiftReport.update({
      where: {
        id: input.id,
      },
      data: workDayShiftReportEntity,
    });
    return PrismaWorkDayShiftReportMapper.toDomain(workDayShiftReport);
  }
}
