import {
  MNGShiftReportCashOper as PrismaWorkDayShiftReportCashOper,
  Prisma,
} from '@prisma/client';
import { ShiftReportCashOper } from '@finance/shiftReport/shiftReportCashOper/doamin/shiftReportCashOper';
export class PrismaShiftReportCashOperMapper {
  static toDomain(
    entity: PrismaWorkDayShiftReportCashOper,
  ): ShiftReportCashOper {
    if (!entity) {
      return null;
    }
    return new ShiftReportCashOper({
      id: entity.id,
      shiftReportId: entity.shiftReportId,
      carWashDeviceId: entity.carWashDeviceId,
      eventDate: entity.eventDate,
      type: entity.type,
      sum: entity.sum,
      comment: entity.comment,
    });
  }

  static toPrisma(
    workDayShiftReportCashOper: ShiftReportCashOper,
  ): Prisma.MNGShiftReportCashOperUncheckedCreateInput {
    return {
      id: workDayShiftReportCashOper?.id,
      shiftReportId: workDayShiftReportCashOper.shiftReportId,
      carWashDeviceId: workDayShiftReportCashOper?.carWashDeviceId,
      eventDate: workDayShiftReportCashOper?.eventDate,
      type: workDayShiftReportCashOper.type,
      sum: workDayShiftReportCashOper.sum,
      comment: workDayShiftReportCashOper?.comment,
    };
  }
}
