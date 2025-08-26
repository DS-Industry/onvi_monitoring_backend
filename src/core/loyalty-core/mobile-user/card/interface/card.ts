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
  abstract getAll(data: CardsFilterDto): Promise<Card[]>;
  abstract getUserKeyStatsByOrganization(data: ClientKeyStatsDto): Promise<UserKeyStatsResponseDto>;
  abstract getClientLoyaltyStats(data: ClientLoyaltyStatsDto): Promise<ClientLoyaltyStatsResponseDto>;
}
