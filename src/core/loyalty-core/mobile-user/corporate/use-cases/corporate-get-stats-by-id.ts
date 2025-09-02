import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientStatsResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-client-stats-response.dto';

@Injectable()
export class CorporateGetStatsByIdUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(id: number): Promise<CorporateClientStatsResponseDto> {
    const corporate = await this.corporateRepository.findOneByIdWithStats(id);

    if (!corporate) {
      throw new Error('Corporate client not exists');
    }

    const workers = corporate.workers || [];
    const cards = workers.flatMap(worker => worker.card || []);
    
    const totalBalance = cards.reduce((sum, card) => sum + (card.balance || 0), 0);
    const numberOfCards = cards.length;

    return {
      totalBalance,
      numberOfCards,
    };
  }
}
