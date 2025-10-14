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

  async delete(cardId: number, tx?: any): Promise<void> {
    const client = tx || this.prisma;
    await client.lTYCard.delete({
      where: { id: cardId },
    });
  }

  async lock(cardId: number): Promise<void> {
    await this.prisma.lTYCard.update({
      where: { id: cardId },
      data: { isLocked: true },
    });
  }

  async reactivate(cardId: number): Promise<void> {
    await this.prisma.lTYCard.update({
      where: { id: cardId },
      data: { 
        isDeleted: false,
        isLocked: false,
      },
    });
  }

  async findActiveCards(clientId: number): Promise<Card[]> {
    const cards = await this.prisma.lTYCard.findMany({
      where: { 
        clientId,
        isDeleted: { not: true }, 
        isLocked: { not: true },
      },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return cards.map(card => Card.fromPrisma(card));
  }

  async findFirstByClientId(clientId: number): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return card ? Card.fromPrisma(card) : null;
  }

  async findFirstByClientIdWithCardTier(clientId: number): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId },
      include: {
        cardTier: true,
        client: true,
        organization: true,
      },
    });

    return card ? Card.fromPrisma(card) : null;
  }

  async findFirstByClientIdWithCardTierAndBenefits(clientId: number): Promise<Card | null> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId },
      include: {
        cardTier: {
          include: {
            benefits: true,
          },
        },
        client: true,
        organization: true,
      },
    });

    return card ? Card.fromPrisma(card) : null;
  }

  async updateBalance(cardId: number, newBalance: number, tx?: any): Promise<void> {
    const client = tx || this.prisma;
    await client.lTYCard.update({
      where: { id: cardId },
      data: { balance: newBalance },
    });
  }
}
