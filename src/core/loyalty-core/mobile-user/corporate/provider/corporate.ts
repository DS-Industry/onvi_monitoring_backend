import { Provider } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateRepository } from '@loyalty/mobile-user/corporate/repository/corporate';

export const CorporateRepositoryProvider: Provider = {
  provide: ICorporateRepository,
  useClass: CorporateRepository,
};
