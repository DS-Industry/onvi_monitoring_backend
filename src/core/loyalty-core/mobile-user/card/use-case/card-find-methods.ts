import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';

@Injectable()
export class FindMethodsCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async getById(id: number): Promise<Card> {
    return await this.cardRepository.findOneById(id);
  }

  async getByClientId(clientId: number): Promise<Card> {
    return await this.cardRepository.findOneByClientId(clientId);
  }

  async getByDevNumber(devNumber: number): Promise<Card> {
    return await this.cardRepository.findOneByDevNumber(devNumber);
  }

  async getByNumber(number: number): Promise<Card> {
    return await this.cardRepository.findOneByNumber(number);
  }

  async getByClientPhone(phone: string): Promise<Card> {
    return await this.cardRepository.findOneByClientPhone(phone);
  }
}
