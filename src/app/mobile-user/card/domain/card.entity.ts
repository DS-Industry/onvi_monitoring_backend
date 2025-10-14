import { LTYCard, LTYCardTier, LTYUser, Organization, LTYBenefit } from '@prisma/client';

export class Card {
  constructor(
    public readonly id: number,
    public readonly balance: number,
    public readonly clientId: number | null,
    public readonly unqNumber: string,
    public readonly number: string,
    public readonly type: string,
    public readonly monthlyLimit: number | null,
    public readonly createdAt: Date | null,
    public readonly updatedAt: Date | null,
    public readonly cardTierId: number | null,
    public readonly organizationId: number | null,
    public readonly isLocked: boolean | null,
    public readonly isDeleted: boolean | null,
    public readonly cardTier?: (LTYCardTier & { benefits?: LTYBenefit[] }) | null,
    public readonly client?: LTYUser | null,
    public readonly organization?: Organization | null,
  ) {}

  static fromPrisma(card: LTYCard & { cardTier?: (LTYCardTier & { benefits?: LTYBenefit[] }) | null; client?: LTYUser | null; organization?: Organization | null }): Card {
    return new Card(
      card.id,
      card.balance,
      card.clientId,
      card.unqNumber,
      card.number,
      card.type,
      card.monthlyLimit,
      card.createdAt,
      card.updatedAt,
      card.cardTierId,
      card.organizationId,
      card.isLocked,
      card.isDeleted,
      card.cardTier,
      card.client,
      card.organization,
    );
  }

  getBalance(): number {
    return this.balance;
  }

  getUnqNumber(): string {
    return this.unqNumber;
  }

  getCardTier(): (LTYCardTier & { benefits?: LTYBenefit[] }) | null {
    return this.cardTier || null;
  }

  getClient(): LTYUser | null {
    return this.client || null;
  }

  isCardActive(): boolean {
    return this.isDeleted === null || this.isDeleted === false;
  }

  isCardLocked(): boolean {
    return this.isLocked === true;
  }
}
