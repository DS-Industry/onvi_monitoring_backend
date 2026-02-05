import { CardType, CardStatus } from '@loyalty/mobile-user/card/domain/enums';

export type CardTierInfo = {
  id: number;
  name: string;
  description: string | null;
  limitBenefit: number;
  ltyProgramId: number;
};

export type CorporateInfo = {
  id: number;
  name: string;
  inn: string;
  address: string;
};

export type CardPaginatedItem = {
  id: number;
  balance: number;
  devNumber: string;
  number: string;
  type: CardType;
  createdAt: Date | null;
  updatedAt: Date | null;
  loyaltyCardTierId: number | null;
  corporateId: number | null;
  cardTier: CardTierInfo | null;
  isCorporate: boolean;
};

export type CardPaginatedResult = {
  cards: CardPaginatedItem[];
  total: number;
};

export type CardInfoResult = {
  id: number;
  balance: number;
  unqNumber: string;
  number: string;
  type: CardType;
  createdAt: Date | null;
  updatedAt: Date | null;
  status: CardStatus | null;
  cardTier: CardTierInfo | null;
  corporate: CorporateInfo | null;
};
