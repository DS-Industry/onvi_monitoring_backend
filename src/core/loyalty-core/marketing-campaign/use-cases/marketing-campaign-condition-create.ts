import { Injectable } from '@nestjs/common';
import { MarketingCampaignConditionResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { CreateMarketingCampaignConditionDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-condition-create.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class CreateMarketingCampaignConditionUseCase {
  constructor(private readonly marketingCampaignRepository: IMarketingCampaignRepository) {}

  async execute(campaignId: number, data: CreateMarketingCampaignConditionDto): Promise<MarketingCampaignConditionResponseDto> {
    return this.marketingCampaignRepository.createCondition(campaignId, data);
  }
}

