import { Provider } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { CardRepository } from '@loyalty/mobile-user/card/repository/card';

export const CardRepositoryProvider: Provider = {
  provide: ICardRepository,
  useClass: CardRepository,
};
