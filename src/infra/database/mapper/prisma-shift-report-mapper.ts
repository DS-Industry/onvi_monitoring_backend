import { ShiftReport as PrismaShiftReport, Prisma } from '@prisma/client';
import { ShiftReport } from '@finance/shiftReport/shiftReport/domain/shiftReport';
export class PrismaShiftReportMapper {
  static toDomain(entity: PrismaShiftReport): ShiftReport {
    if (!entity) {
      return null;
    }
    return new ShiftReport({
      id: entity.id,
      posId: entity.posId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(
    shiftReport: ShiftReport,
  ): Prisma.ShiftReportUncheckedCreateInput {
    return {
      id: shiftReport?.id,
      posId: shiftReport?.posId,
      startDate: shiftReport.startDate,
      endDate: shiftReport.endDate,
      createdAt: shiftReport.createdAt,
      updatedAt: shiftReport.updatedAt,
      createdById: shiftReport.createdById,
      updatedById: shiftReport.updatedById,
    };
  }
}
