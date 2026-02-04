import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { CardsFilterDto } from '@platform-user/core-controller/dto/receive/cards.filter.dto';
import { ClientKeyStatsDto } from '@platform-user/core-controller/dto/receive/client-key-stats.dto';
import { UserKeyStatsResponseDto } from '@platform-user/core-controller/dto/response/user-key-stats-response.dto';
import { ClientLoyaltyStatsDto } from '@platform-user/core-controller/dto/receive/client-loyalty-stats.dto';
import { ClientLoyaltyStatsResponseDto } from '@platform-user/core-controller/dto/response/client-loyalty-stats-response.dto';

export abstract class ICardRepository {
  abstract create(input: Card): Promise<Card>;
  abstract findOneById(id: number): Promise<Card | null>;
  abstract findOneByClientId(id: number): Promise<Card | null>;
  abstract findOneByUnqNumber(unqNumber: string): Promise<Card | null>;
  abstract findOneByNumber(number: string): Promise<Card | null>;
  abstract findOneByClientPhone(phone: string): Promise<Card | null>;
  abstract findFullCardInfoForDevice(
    unqNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto | null>;
  abstract update(input: Card): Promise<Card>;
  abstract updateTier(id: number, tierId: number): Promise<Card>;
  abstract getAll(data: CardsFilterDto): Promise<Card[]>;
  abstract getAllPaginated(data: {
    organizationId: number;
    unqNumber?: string;
    number?: string;
    type?: string;
    isCorporate?: boolean;
    page?: number;
    size?: number;
  }): Promise<{
    cards: Array<{
      id: number;
      balance: number;
      devNumber: string;
      number: string;
      type: import('@prisma/client').LTYCardType;
      createdAt: Date | null;
      updatedAt: Date | null;
      loyaltyCardTierId: number | null;
      corporateId: number | null;
      cardTier: {
        id: number;
        name: string;
        description: string | null;
        limitBenefit: number;
      } | null;
      isCorporate: boolean;
    }>;
    total: number;
  }>;
  abstract getUserKeyStatsByOrganization(
    data: ClientKeyStatsDto,
  ): Promise<UserKeyStatsResponseDto>;
  abstract getClientLoyaltyStats(
    data: ClientLoyaltyStatsDto,
  ): Promise<ClientLoyaltyStatsResponseDto>;
  abstract findOwnerCorporationCard(
    unqNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto | null>;
  abstract validateOrganizationExists(organizationId: number): Promise<boolean>;
  abstract validateTierExistsAndAccessible(
    tierId: number,
    organizationId: number,
  ): Promise<boolean>;
  abstract checkCardExists(
    devNumber: string,
    uniqueNumber: string,
  ): Promise<boolean>;
  abstract countByLoyaltyProgramId(loyaltyProgramId: number): Promise<number>;
  abstract getTransactionAnalyticsByLoyaltyProgramId(
    loyaltyProgramId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: Date; accruals: number; debits: number }[]>;
  abstract findCardsByTierId(tierId: number): Promise<Card[]>;
}
