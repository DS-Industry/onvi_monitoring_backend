import { TechExpenseReport as PrismaTechExpenseReport, Prisma } from "@prisma/client";
import { TechExpenseReport } from "@tech-report/techExpenseReport/domain/techExpenseReport";

export class PrismaTechExpenseReportMapper {
  static toDomain(entity: PrismaTechExpenseReport): TechExpenseReport {
    if (!entity) {
      return null;
    }
    return new TechExpenseReport({
      id: entity.id,
      posId: entity.posId,
      startPeriod: entity.startPeriod,
      endPeriod: entity.endPeriod,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    })
  }

  static toPrisma(techExpenseReport: TechExpenseReport): Prisma.TechExpenseReportUncheckedCreateInput {
    return {
      id: techExpenseReport?.id,
      posId: techExpenseReport.posId,
      startPeriod: techExpenseReport.startPeriod,
      endPeriod: techExpenseReport.endPeriod,
      status: techExpenseReport.status,
      createdAt: techExpenseReport.createdAt,
      updatedAt: techExpenseReport.updatedAt,
      createdById: techExpenseReport.createdById,
      updatedById: techExpenseReport.updatedById,
    }
  }
}