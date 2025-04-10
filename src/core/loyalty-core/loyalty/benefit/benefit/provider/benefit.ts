import { Provider } from '@nestjs/common';
import { IBenefitRepository } from '@loyalty/loyalty/benefit/benefit/interface/benefit';
import { BenefitRepository } from '@loyalty/loyalty/benefit/benefit/repository/benefit';

export const BenefitRepositoryProvider: Provider = {
  provide: IBenefitRepository,
  useClass: BenefitRepository,
};
