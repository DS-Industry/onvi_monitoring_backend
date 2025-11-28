import { MNGShiftReport as PrismaShiftReport, Prisma } from '@prisma/client';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
export class PrismaShiftReportMapper {
  static toDomain(entity: PrismaShiftReport): ShiftReport {
    if (!entity) {
      return null;
    }
    return new ShiftReport({
      id: entity.id,
      posId: entity.posId,
      workerId: entity.workerId,
      workDate: entity.workDate,
      typeWorkDay: entity.typeWorkDay,
      timeWorkedOut: entity.timeWorkedOut,
      startWorkingTime: entity.startWorkingTime,
      endWorkingTime: entity.endWorkingTime,
      estimation: entity.estimation,
      status: entity.status,
      cashAtStart: entity.cashAtStart,
      cashAtEnd: entity.cashAtEnd,
      dailyShiftPayout: entity.dailyShiftPayout,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    shiftReport: ShiftReport,
  ): Prisma.MNGShiftReportUncheckedCreateInput {
    return {
      id: shiftReport?.id,
      posId: shiftReport?.posId,
      workerId: shiftReport.workerId,
      workDate: shiftReport.workDate,
      typeWorkDay: shiftReport.typeWorkDay,
      timeWorkedOut: shiftReport?.timeWorkedOut,
      startWorkingTime: shiftReport.startWorkingTime,
      endWorkingTime: shiftReport.endWorkingTime,
      estimation: shiftReport.estimation,
      status: shiftReport?.status,
      cashAtStart: shiftReport?.cashAtStart,
      cashAtEnd: shiftReport?.cashAtEnd,
      dailyShiftPayout: shiftReport?.dailyShiftPayout,
      comment: shiftReport.comment,
      createdAt: shiftReport.createdAt,
      updatedAt: shiftReport.updatedAt,
      createdById: shiftReport.createdById,
      updatedById: shiftReport.updatedById,
    };
  }
}
