import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';

@Injectable()
export class FindMethodsCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async getById(id: number): Promise<Card> {
    return await this.cardRepository.findOneById(id);
  }

  async getByClientId(clientId: number): Promise<Card> {
    return await this.cardRepository.findOneByClientId(clientId);
  }

  async getByDevNumber(devNumber: string): Promise<Card> {
    return await this.cardRepository.findOneByUnqNumber(devNumber);
  }

  async getByNumber(number: string): Promise<Card> {
    return await this.cardRepository.findOneByNumber(number);
  }

  async getByClientPhone(phone: string): Promise<Card> {
    return await this.cardRepository.findOneByClientPhone(phone);
  }

  async getFullCardInfoForDevice(
    devNumber: string,
  ): Promise<LoyaltyCardInfoFullResponseDto> {
    return await this.cardRepository.findFullCardInfoForDevice(devNumber);
  }
}
