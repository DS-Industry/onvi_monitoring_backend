import { TechExpenseReportItem as PrismaTechExpenseReportItem, Prisma } from "@prisma/client";
import { TechExpenseReportItem } from "@tech-report/techExpenseReportItem/domain/techExpenseReportItem";

export class PrismaTechExpenseReportItemMapper {
  static toDomain(entity: PrismaTechExpenseReportItem): TechExpenseReportItem {
    if (!entity) {
      return null;
    }
    return new TechExpenseReportItem({
      id: entity.id,
      techConsumablesId: entity.techConsumablesId,
      techExpenseReportId: entity.techExpenseReportId,
      quantityAtStart: entity.quantityAtStart,
      quantityByReport: entity.quantityByReport,
      quantityOnWarehouse: entity.quantityOnWarehouse,
      quantityWriteOff: entity?.quantityWriteOff,
      quantityAtEnd: entity?.quantityAtEnd,
    })
  }

  static toPrisma(techExpenseReportItem: TechExpenseReportItem): Prisma.TechExpenseReportItemUncheckedCreateInput {
    return {
      id: techExpenseReportItem?.id,
      techConsumablesId: techExpenseReportItem.techConsumablesId,
      techExpenseReportId: techExpenseReportItem.techExpenseReportId,
      quantityAtStart: techExpenseReportItem.quantityAtStart,
      quantityByReport: techExpenseReportItem.quantityByReport,
      quantityOnWarehouse: techExpenseReportItem.quantityOnWarehouse,
      quantityWriteOff: techExpenseReportItem?.quantityWriteOff,
      quantityAtEnd: techExpenseReportItem?.quantityAtEnd,
    }
  }
}