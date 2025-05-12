import { Provider } from '@nestjs/common';
import { ICardBonusOperTypeRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/interface/cardBonusOperType';
import { CardBonusOperTypeRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/repository/cardBonusOperType';

export const CardBonusOperTypeProvider: Provider = {
  provide: ICardBonusOperTypeRepository,
  useClass: CardBonusOperTypeRepository,
};
