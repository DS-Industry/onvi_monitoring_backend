import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ICardRepository } from '../domain/card.repository.interface';
import { Card } from '../domain/card.entity';

@Injectable()
export class CardRepository implements ICardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByClientId(clientId: number): Promise<Card[]> {
    const cards = await this.prisma.lTYCard.findMany({
      where: { clientId },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return cards.map(card => Card.fromPrisma(card));
  }

  async findOneByUnqNumber(unqNumber: string): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { unqNumber },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return card ? Card.fromPrisma(card) : null;
  }

  async findOneByUnqNumberWithClient(unqNumber: string): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { 
        unqNumber,
        client: {
          isNot: null,
        },
      },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return card ? Card.fromPrisma(card) : null;
  }

  async findCardTierByCardId(cardId: number): Promise<number | null> {
    const card = await this.prisma.lTYCard.findUnique({
      where: { id: cardId },
      select: { cardTierId: true },
    });

    return card?.cardTierId || null;
  }

  async delete(cardId: number): Promise<void> {
    await this.prisma.lTYCard.delete({
      where: { id: cardId },
    });
  }

  async lock(cardId: number): Promise<void> {
    // For now, we'll implement this as a soft delete or status change
    // Since LTYCard doesn't have a locked field, we might need to add one
    // or implement this differently based on business requirements
    throw new Error('Lock functionality not implemented yet');
  }

  async reactivate(cardId: number): Promise<void> {
    // Similar to lock, this might need to be implemented based on business requirements
    throw new Error('Reactivate functionality not implemented yet');
  }
}
