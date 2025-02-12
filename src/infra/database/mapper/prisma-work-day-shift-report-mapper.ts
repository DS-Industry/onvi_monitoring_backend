import {
  WorkDayShiftReport as PrismaWorkDayShiftReport,
  Prisma,
} from '@prisma/client';
import { WorkDayShiftReport } from '@finance/shiftReport/workDayShiftReport/domain/workDayShiftReport';
export class PrismaWorkDayShiftReportMapper {
  static toDomain(entity: PrismaWorkDayShiftReport): WorkDayShiftReport {
    if (!entity) {
      return null;
    }
    return new WorkDayShiftReport({
      id: entity.id,
      shiftReportId: entity.shiftReportId,
      workerId: entity.workerId,
      workDate: entity.workDate,
      typeWorkDay: entity.typeWorkDay,
      startWorkingTime: entity.startWorkingTime,
      endWorkingTime: entity.endWorkingTime,
      estimation: entity.estimation,
      prize: entity.prize,
      fine: entity.fine,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    workDayShiftReport: WorkDayShiftReport,
  ): Prisma.WorkDayShiftReportUncheckedCreateInput {
    return {
      id: workDayShiftReport?.id,
      shiftReportId: workDayShiftReport.shiftReportId,
      workerId: workDayShiftReport.workerId,
      workDate: workDayShiftReport.workDate,
      typeWorkDay: workDayShiftReport.typeWorkDay,
      startWorkingTime: workDayShiftReport.startWorkingTime,
      endWorkingTime: workDayShiftReport.endWorkingTime,
      estimation: workDayShiftReport.estimation,
      prize: workDayShiftReport.prize,
      fine: workDayShiftReport.fine,
      comment: workDayShiftReport.comment,
      createdAt: workDayShiftReport.createdAt,
      createdById: workDayShiftReport.createdById,
      updatedById: workDayShiftReport.updatedById,
      updatedAt: workDayShiftReport.updatedAt,
    };
  }
}
