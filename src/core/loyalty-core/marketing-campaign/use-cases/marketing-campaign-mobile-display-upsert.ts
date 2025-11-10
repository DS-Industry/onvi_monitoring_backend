import { Injectable } from '@nestjs/common';
import { UpsertMarketingCampaignMobileDisplayDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-mobile-display-upsert.dto';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class UpsertMarketingCampaignMobileDisplayUseCase {
  constructor(private readonly marketingCampaignRepository: IMarketingCampaignRepository) {}

  async execute(
    campaignId: number,
    data: UpsertMarketingCampaignMobileDisplayDto,
  ): Promise<MarketingCampaignMobileDisplayResponseDto> {
    return this.marketingCampaignRepository.upsertMobileDisplay(campaignId, data);
  }
}


