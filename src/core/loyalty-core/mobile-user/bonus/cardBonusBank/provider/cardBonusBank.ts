import { Provider } from '@nestjs/common';
import { ICardBonusBankRepository } from '@loyalty/mobile-user/bonus/cardBonusBank/interface/cardBonusBank';
import { CardBonusBankRepository } from '@loyalty/mobile-user/bonus/cardBonusBank/repository/cardBonusBank';

export const CardBonusBankProvider: Provider = {
  provide: ICardBonusBankRepository,
  useClass: CardBonusBankRepository,
};
