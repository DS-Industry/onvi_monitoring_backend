import {
  PosPositionSalaryRate as PrismaPosPositionSalaryRate,
  Prisma,
} from '@prisma/client';
import { PosPositionSalaryRate } from '@finance/shiftReport/posPositionSalaryRate/domain/posPositionSalaryRate';

export class PrismaPosPositionSalaryRateMapper {
  static toDomain(
    entity: PrismaPosPositionSalaryRate | null,
  ): PosPositionSalaryRate | null {
    if (!entity) {
      return null;
    }
    return new PosPositionSalaryRate({
      id: entity.id,
      posId: entity.posId,
      hrPositionId: entity.hrPositionId,
      baseRateDay: entity.baseRateDay,
      bonusRateDay: entity.bonusRateDay,
      baseRateNight: entity.baseRateNight,
      bonusRateNight: entity.bonusRateNight,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(
    salaryRate: PosPositionSalaryRate,
  ): Prisma.PosPositionSalaryRateUncheckedCreateInput {
    return {
      id: salaryRate?.id,
      posId: salaryRate.posId,
      hrPositionId: salaryRate.hrPositionId,
      baseRateDay: salaryRate.baseRateDay ?? null,
      bonusRateDay: salaryRate.bonusRateDay ?? null,
      baseRateNight: salaryRate.baseRateNight ?? null,
      bonusRateNight: salaryRate.bonusRateNight ?? null,
    };
  }
}

