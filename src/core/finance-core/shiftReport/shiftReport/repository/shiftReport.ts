import { Injectable } from '@nestjs/common';
import { IShiftReportRepository } from '@finance/shiftReport/shiftReport/interface/shiftReport';
import { PrismaService } from '@db/prisma/prisma.service';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
import { PrismaShiftReportMapper } from '@db/mapper/prisma-shift-report-mapper';
import { StatusWorkDayShiftReport, TypeWorkDay } from "@prisma/client";
import { DataForCalculationResponseDto } from '@finance/shiftReport/shiftReport/use-cases/dto/data-for-calculation-response.dto';

@Injectable()
export class ShiftReportRepository extends IShiftReportRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ShiftReport): Promise<ShiftReport> {
    const shiftReportEntity = PrismaShiftReportMapper.toPrisma(input);
    const shiftReport = await this.prisma.mNGShiftReport.create({
      data: shiftReportEntity,
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findOneById(id: number): Promise<ShiftReport> {
    const shiftReport = await this.prisma.mNGShiftReport.findFirst({
      where: {
        id,
      },
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    posId: number,
  ): Promise<ShiftReport[]> {
    const shiftReports = await this.prisma.mNGShiftReport.findMany({
      where: {
        posId,
        workDate: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        workDate: 'asc',
      },
    });
    return shiftReports.map((item) => PrismaShiftReportMapper.toDomain(item));
  }
  public async findOnePosIdAndWorkerIdAndDate(
    posId: number,
    workerId: number,
    workDate: Date,
  ): Promise<ShiftReport> {
    const shiftReport = await this.prisma.mNGShiftReport.findFirst({
      where: {
        posId,
        workerId,
        workDate,
      },
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findLastByStatusSentAndPosId(
    posId: number,
    workDate: Date,
  ): Promise<ShiftReport> {
    const shiftReport = await this.prisma.mNGShiftReport.findFirst({
      where: {
        posId,
        status: StatusWorkDayShiftReport.SENT,
        workDate: {
          lt: workDate,
        },
      },
      orderBy: {
        workDate: 'desc',
      },
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }
  public async findAllForCalculation(
    dateStart: Date,
    dateEnd: Date,
    workerIds: number[],
  ): Promise<DataForCalculationResponseDto[]> {
    const shiftReports = await this.prisma.mNGShiftReport.findMany({
      where: {
        workDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        workerId: {
          in: workerIds,
        },
        typeWorkDay: TypeWorkDay.WORKING,
        status: StatusWorkDayShiftReport.SENT,
      },
      include: {
        shiftGrading: {
          include: {
            gradingParameter: true,
            gradingEstimation: true,
          },
        },
      },
      orderBy: {
        workDate: 'asc',
      },
    });

    return shiftReports.map((report) => ({
      workerId: report.workerId,
      shiftReportId: report.id,
      gradingData: report.shiftGrading.map((grading) => ({
        parameterWeightPercent: grading.gradingParameter?.weightPercent || 0,
        estimationWeightPercent: grading.gradingEstimation?.weightPercent || 0,
      })),
    }));
  }
  
  public async findAllWithPayoutForCalculation(
    dateStart: Date,
    dateEnd: Date,
    workerIds: number[],
  ): Promise<ShiftReport[]> {
    const shiftReports = await this.prisma.mNGShiftReport.findMany({
      where: {
        workDate: {
          gte: dateStart,
          lte: dateEnd,
        },
        workerId: {
          in: workerIds,
        },
        typeWorkDay: TypeWorkDay.WORKING,
        status: StatusWorkDayShiftReport.SENT,
        dailyShiftPayout: {
          not: null, 
        },
      },
      orderBy: {
        workDate: 'asc',
      },
    });

    return shiftReports.map((report) => PrismaShiftReportMapper.toDomain(report));
  }
  
  public async update(input: ShiftReport): Promise<ShiftReport> {
    const shiftReportEntity = PrismaShiftReportMapper.toPrisma(input);
    const shiftReport = await this.prisma.mNGShiftReport.update({
      where: {
        id: input.id,
      },
      data: shiftReportEntity,
    });
    return PrismaShiftReportMapper.toDomain(shiftReport);
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.mNGShiftReport.delete({
      where: {
        id,
      },
    });
  }
}
