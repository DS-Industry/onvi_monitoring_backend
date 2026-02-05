import { CardStatus } from '@loyalty/mobile-user/card/domain/enums';
import { LTYCardType } from '@prisma/client';

export class CardTierResponseDto {
  id: number;
  name: string;
  description?: string | null;
  limitBenefit: number;
  ltyProgramId: number;
}

export class CorporateInfoDto {
  id: number;
  name: string;
  inn: string;
  address: string;
}

export class CardResponseDto {
  id: number;
  balance: number;
  unqNumber: string;
  number: string;
  type: LTYCardType;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  cardTier?: CardTierResponseDto | null;
  isCorporate: boolean;
}

export class CardInfoResponseDto {
  id: number;
  balance: number;
  unqNumber: string;
  number: string;
  type: LTYCardType;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  cardTier?: CardTierResponseDto | null;
  corporate?: CorporateInfoDto | null;
  status?: CardStatus | null;
  limitBenefit?: number | null;
  loyaltyProgramId?: number | null;
}

export class CardsPaginatedResponseDto {
  cards: CardResponseDto[];
  total: number;
  page: number;
  size: number;
}
