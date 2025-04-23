import {
  WorkDayShiftReportCashOper as PrismaWorkDayShiftReportCashOper,
  Prisma,
} from '@prisma/client';
import { WorkDayShiftReportCashOper } from '@finance/shiftReport/workDayShiftReportCashOper/doamin/workDayShiftReportCashOper';
export class PrismaWorkDayShiftReportCashOperMapper {
  static toDomain(
    entity: PrismaWorkDayShiftReportCashOper,
  ): WorkDayShiftReportCashOper {
    if (!entity) {
      return null;
    }
    return new WorkDayShiftReportCashOper({
      id: entity.id,
      workDayShiftReportId: entity.workDayShiftReportId,
      carWashDeviceId: entity.carWashDeviceId,
      eventDate: entity.eventDate,
      type: entity.type,
      sum: entity.sum,
      comment: entity.comment,
    });
  }

  static toPrisma(
    workDayShiftReportCashOper: WorkDayShiftReportCashOper,
  ): Prisma.WorkDayShiftReportCashOperUncheckedCreateInput {
    return {
      id: workDayShiftReportCashOper?.id,
      workDayShiftReportId: workDayShiftReportCashOper.workDayShiftReportId,
      carWashDeviceId: workDayShiftReportCashOper?.carWashDeviceId,
      eventDate: workDayShiftReportCashOper?.eventDate,
      type: workDayShiftReportCashOper.type,
      sum: workDayShiftReportCashOper.sum,
      comment: workDayShiftReportCashOper?.comment,
    };
  }
}
