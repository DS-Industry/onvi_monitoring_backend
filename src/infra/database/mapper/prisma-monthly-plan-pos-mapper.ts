import { MonthlyPlanPos as PrismaMonthlyPlanPos, Prisma } from '@prisma/client';
import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';
export class PrismaMonthlyPlanPosMapper {
  static toDomain(entity: PrismaMonthlyPlanPos): MonthlyPlanPos {
    if (!entity) {
      return null;
    }
    return new MonthlyPlanPos({
      id: entity.id,
      posId: entity.posId,
      monthDate: entity.monthDate,
      monthlyPlan: entity.monthlyPlan,
    });
  }

  static toPrisma(
    monthlyPlanPos: MonthlyPlanPos,
  ): Prisma.MonthlyPlanPosUncheckedCreateInput {
    return {
      id: monthlyPlanPos?.id,
      posId: monthlyPlanPos.posId,
      monthDate: monthlyPlanPos.monthDate,
      monthlyPlan: monthlyPlanPos.monthlyPlan,
    };
  }
}
