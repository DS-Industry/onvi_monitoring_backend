import { Injectable } from '@nestjs/common';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class FindMethodsMarketingCampaignUseCase {
  constructor(private readonly marketingCampaignRepository: IMarketingCampaignRepository) {}

  async getOneById(id: number): Promise<MarketingCampaignResponseDto | null> {
    return this.marketingCampaignRepository.findOneById(id);
  }

  async getAll(): Promise<MarketingCampaignResponseDto[]> {
    return this.marketingCampaignRepository.findAll();
  }
}

