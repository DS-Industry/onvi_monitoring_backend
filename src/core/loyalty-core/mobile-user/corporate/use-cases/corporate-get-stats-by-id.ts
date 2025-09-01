import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateClientStatsResponseDto } from '../../../../../app/platform-user/core-controller/dto/response/corporate-client-stats-response.dto';

@Injectable()
export class CorporateGetStatsByIdUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(id: number): Promise<CorporateClientStatsResponseDto> {
    const stats = await this.corporateRepository.getStatsById(id);
    
    return {
      totalBalance: stats.totalBalance,
      numberOfCards: stats.numberOfCards,
    };
  }
}
