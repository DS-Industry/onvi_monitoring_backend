import { LTYCardType } from '@prisma/client';

export class CardTierResponseDto {
  id: number;
  name: string;
  description?: string | null;
  limitBenefit: number;
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

export class CardsPaginatedResponseDto {
  cards: CardResponseDto[];
  total: number;
  page: number;
  size: number;
}
