import { Provider } from '@nestjs/common';
import { ICardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/interface/cardBonusOper';
import { CardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/repository/cardBonusOper';

export const CardBonusOperProvider: Provider = {
  provide: ICardBonusOperRepository,
  useClass: CardBonusOperRepository,
};
