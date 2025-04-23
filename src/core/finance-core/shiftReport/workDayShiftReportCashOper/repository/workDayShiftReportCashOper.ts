import { Injectable } from '@nestjs/common';
import { IWorkDayShiftReportCashOperRepository } from '@finance/shiftReport/workDayShiftReportCashOper/interface/workDayShiftReportCashOper';
import { PrismaService } from '@db/prisma/prisma.service';
import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';
import { PrismaWorkDayShiftReportCashOperMapper } from '@db/mapper/prisma-work-day-shift-report-cash-oper-mapper';
import { TypeWorkDayShiftReportCashOper } from '@prisma/client';

@Injectable()
export class WorkDayShiftReportCashOperRepository extends IWorkDayShiftReportCashOperRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: WorkDayShiftReportCashOper,
  ): Promise<WorkDayShiftReportCashOper> {
    const workDayShiftReportCashOperEntity =
      PrismaWorkDayShiftReportCashOperMapper.toPrisma(input);
    const workDayShiftReportCashOper =
      await this.prisma.workDayShiftReportCashOper.create({
        data: workDayShiftReportCashOperEntity,
      });
    return PrismaWorkDayShiftReportCashOperMapper.toDomain(
      workDayShiftReportCashOper,
    );
  }

  public async findAllByWorkDayId(
    workDayShiftReportId: number,
  ): Promise<WorkDayShiftReportCashOper[]> {
    const workDayShiftReportCashOpers =
      await this.prisma.workDayShiftReportCashOper.findMany({
        where: {
          workDayShiftReportId,
        },
      });
    return workDayShiftReportCashOpers.map((item) =>
      PrismaWorkDayShiftReportCashOperMapper.toDomain(item),
    );
  }

  public async findAllByWorkDayIdAndType(
    workDayShiftReportId: number,
    type: TypeWorkDayShiftReportCashOper,
  ): Promise<WorkDayShiftReportCashOper[]> {
    const workDayShiftReportCashOpers =
      await this.prisma.workDayShiftReportCashOper.findMany({
        where: {
          workDayShiftReportId,
          type,
        },
      });
    return workDayShiftReportCashOpers.map((item) =>
      PrismaWorkDayShiftReportCashOperMapper.toDomain(item),
    );
  }
}
