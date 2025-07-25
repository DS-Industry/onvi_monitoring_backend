import { LTYBenefit as PrismaBenefit, Prisma } from '@prisma/client';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';

export class PrismaBenefitMapper {
  static toDomain(entity: PrismaBenefit): Benefit {
    if (!entity) {
      return null;
    }
    return new Benefit({
      id: entity.id,
      name: entity.name,
      benefitType: entity.benefitType,
      bonus: entity.bonus,
      benefitActionTypeId: entity.benefitActionTypeId,
    });
  }

  static toPrisma(benefit: Benefit): Prisma.LTYBenefitUncheckedCreateInput {
    return {
      id: benefit?.id,
      name: benefit.name,
      benefitType: benefit.benefitType,
      bonus: benefit.bonus,
      benefitActionTypeId: benefit?.benefitActionTypeId,
    };
  }
}
