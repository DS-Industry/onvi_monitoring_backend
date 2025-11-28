import {
  LTYBenefitActionType as PrismaBenefitAction,
  Prisma,
} from '@prisma/client';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';

export class PrismaBenefitActionMapper {
  static toDomain(entity: PrismaBenefitAction): BenefitAction {
    if (!entity) {
      return null;
    }
    return new BenefitAction({
      id: entity.id,
      name: entity.name,
      description: entity.description,
    });
  }

  static toPrisma(
    benefitAction: BenefitAction,
  ): Prisma.LTYBenefitActionTypeUncheckedCreateInput {
    return {
      id: benefitAction?.id,
      name: benefitAction.name,
      description: benefitAction?.description,
    };
  }
}
