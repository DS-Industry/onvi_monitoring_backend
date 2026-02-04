import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
import { ClientKeyStatsDto } from '@platform-user/core-controller/dto/receive/client-key-stats.dto';
import { UserKeyStatsResponseDto } from '@platform-user/core-controller/dto/response/user-key-stats-response.dto';
import { ClientLoyaltyStatsDto } from '@platform-user/core-controller/dto/receive/client-loyalty-stats.dto';
import { ClientLoyaltyStatsResponseDto } from '@platform-user/core-controller/dto/response/client-loyalty-stats-response.dto';

@Injectable()
export class FindMethodsCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async getById(id: number): Promise<Card | null> {
    return await this.cardRepository.findOneById(id);
  }

  async getByClientId(clientId: number): Promise<Card | null> {
    return await this.cardRepository.findOneByClientId(clientId);
  }

  async getByDevNumber(devNumber: string): Promise<Card | null> {
    return await this.cardRepository.findOneByUnqNumber(devNumber);
  }

  async getByNumber(number: string): Promise<Card | null> {
    return await this.cardRepository.findOneByNumber(number);
  }

  async getByClientPhone(phone: string): Promise<Card | null> {
    return await this.cardRepository.findOneByClientPhone(phone);
  }

  async getFullCardInfoForDevice(
    devNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto | null> {
    return await this.cardRepository.findFullCardInfoForDevice(devNumber);
  }

  async getOwnerCorporationCard(
    unqNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto | null> {
    return await this.cardRepository.findOwnerCorporationCard(unqNumber);
  }

  async getAll(data: {
    unqNumber?: string;
    organizationId?: number;
    unnasigned?: boolean;
  }): Promise<Card[]> {
    return await this.cardRepository.getAll(data);
  }

  async getAllPaginated(data: {
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
      type: string;
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
  }> {
    return await this.cardRepository.getAllPaginated(data);
  }

  async getUserKeyStatsByOrganization(
    data: ClientKeyStatsDto,
  ): Promise<UserKeyStatsResponseDto> {
    return await this.cardRepository.getUserKeyStatsByOrganization(data);
  }

  async getClientLoyaltyStats(
    data: ClientLoyaltyStatsDto,
  ): Promise<ClientLoyaltyStatsResponseDto> {
    return await this.cardRepository.getClientLoyaltyStats(data);
  }
}
