import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';

export abstract class IBenefitActionRepository {
  abstract create(input: BenefitAction): Promise<BenefitAction>;
  abstract findOneById(id: number): Promise<BenefitAction>;
  abstract findAll(): Promise<BenefitAction[]>;
  abstract update(input: BenefitAction): Promise<BenefitAction>;
}
