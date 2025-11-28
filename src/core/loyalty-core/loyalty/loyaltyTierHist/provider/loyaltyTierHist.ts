import { Provider } from '@nestjs/common';
import { ILoyaltyTierHistRepository } from '@loyalty/loyalty/loyaltyTierHist/interface/loyaltyTierHist';
import { LoyaltyTierHistRepository } from '@loyalty/loyalty/loyaltyTierHist/repository/loyaltyTierHist';

export const LoyaltyTierHistRepositoryProvider: Provider = {
  provide: ILoyaltyTierHistRepository,
  useClass: LoyaltyTierHistRepository,
};
