import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class GetCardTariffUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(user: any): Promise<{ cashBack: number }> {
    // Get user's card with card tier
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId: user.clientId },
      include: {
        cardTier: {
          include: {
            benefits: true,
          },
        },
      },
    });

    if (!card || !card.cardTier) {
      throw new Error('Card or card tier not found');
    }

    // Calculate cashback from card tier benefits
    // The original code used tariff.bonus, now we need to calculate from benefits
    let cashBack = 0;
    
    if (card.cardTier.benefits && card.cardTier.benefits.length > 0) {
      // Find cashback benefit
      const cashbackBenefit = card.cardTier.benefits.find(
        benefit => benefit.benefitType === 'CASHBACK'
      );
      
      if (cashbackBenefit) {
        cashBack = cashbackBenefit.bonus;
      }
    }

    return { cashBack };
  }
}
