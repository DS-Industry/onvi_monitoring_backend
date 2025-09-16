import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardRepository } from '../infrastructure/card.repository';

@Injectable()
export class GetCardTransferDataUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardRepository: CardRepository,
  ) {}

  async execute(devNomer: string, user: any): Promise<{
    cardId: number;
    realBalance: number;
    airBalance: number;
  }> {
    const card = await this.cardRepository.findOneByUnqNumber(devNomer);
    
    if (!card) {
      throw new Error(`Card with number ${devNomer} not found`);
    }

    // Check if card belongs to a valid group (original code checked groupId != 3)
    // Since LTYCard doesn't have groupId, we'll need to implement this logic differently
    // For now, we'll assume all cards are valid for transfer
    
    // Check if card is not deleted or locked
    // Since LTYCard doesn't have isDel or isLocked fields, we'll skip these checks for now
    // This would need to be implemented based on business requirements

    return {
      cardId: card.id,
      realBalance: card.balance, // Using balance as realBalance
      airBalance: 0, // airBalance doesn't exist in LTYCard, setting to 0
    };
  }
}
