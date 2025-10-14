import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardRepository } from '../infrastructure/card.repository';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardRepository: CardRepository,
  ) {}

  async getCardByClientId(clientId: number) {
    const cards = await this.cardRepository.findByClientId(clientId);
    return cards.length > 0 ? cards[0] : null;
  }

  async getCardBalance(unqNumber: string): Promise<any> {
    const card = await this.cardRepository.findOneByUnqNumber(unqNumber);

    if (!card) return null;

    return {
      unqNumber: card.unqNumber,
      balance: card.balance,
    };
  }
}
