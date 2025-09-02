import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateCardsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-cards-paginated-response.dto';
import { CorporateCardsFilterDto } from '@platform-user/core-controller/dto/receive/corporate-cards-filter.dto';

@Injectable()
export class CorporateGetCardsUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(corporateId: number, data: CorporateCardsFilterDto): Promise<CorporateCardsPaginatedResponseDto> {
    const corporate = await this.corporateRepository.findOneById(corporateId);
    if (!corporate) {
      throw new Error('Corporate client not exists');
    }

    return await this.corporateRepository.findCardsByCorporateId(
      corporateId,
      data.skip,
      data.take,
      data.search,
    );
  }
}
