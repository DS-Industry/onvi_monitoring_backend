import { Injectable } from '@nestjs/common';
import { ICorporateRepository } from '@loyalty/mobile-user/corporate/interfaces/corporate';
import { CorporateCardsOperationsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/corporate-cards-operations-paginated-response.dto';
import { CorporateCardsOperationsFilterDto } from '@platform-user/core-controller/dto/receive/corporate-cards-operations-filter.dto';

@Injectable()
export class CorporateGetCardsOperationsUseCase {
  constructor(private readonly corporateRepository: ICorporateRepository) {}

  async execute(corporateId: number, data: CorporateCardsOperationsFilterDto): Promise<CorporateCardsOperationsPaginatedResponseDto> {
    const corporate = await this.corporateRepository.findOneById(corporateId);
    if (!corporate) {
      throw new Error('Corporate client not exists');
    }

    return await this.corporateRepository.findCardsOperationsByCorporateId(
      corporateId,
      data.skip,
      data.take,
      data.search,
      data.platform,
      data.orderStatus,
      data.contractType,
      data.carWashDeviceId,
      data.dateFrom,
      data.dateTo,
      data.minSumFull,
      data.maxSumFull,
      data.minSumBonus,
      data.maxSumBonus,
    );
  }
}
