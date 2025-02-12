import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportRepository } from '@finance/shiftReport/workDayShiftReport/interface/workDayShiftReport';
import { PrismaService } from '@db/prisma/prisma.service';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
import { PrismaWorkDayShiftReportMapper } from '@db/mapper/prisma-work-day-shift-report-mapper';

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
