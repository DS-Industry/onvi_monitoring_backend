import { Provider } from '@nestjs/common';
import { IBenefitActionRepository } from '@loyalty/loyalty/benefit/benefitAction/interface/benefitAction';
import { BenefitActionRepository } from '@loyalty/loyalty/benefit/benefitAction/repository/benefitAction';

export const BenefitActionRepositoryProvider: Provider = {
  provide: IBenefitActionRepository,
  useClass: BenefitActionRepository,
};
