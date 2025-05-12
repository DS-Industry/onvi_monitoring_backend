import { Provider } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { LoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/repository/loyaltyTier';

export const LoyaltyTierRepositoryProvider: Provider = {
  provide: ILoyaltyTierRepository,
  useClass: LoyaltyTierRepository,
};
