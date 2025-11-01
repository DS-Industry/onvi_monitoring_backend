import { Provider } from '@nestjs/common';
import { IPromoCodeRepository } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';
import { PromoCodeRepository } from '@loyalty/marketing-campaign/repository/promo-code.repository';

export const PromoCodeRepositoryProvider: Provider = {
  provide: IPromoCodeRepository,
  useClass: PromoCodeRepository,
};


