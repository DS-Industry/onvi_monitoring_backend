import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignActionCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-create.dto';

@Injectable()
export class CreateMarketingCampaignActionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(data: MarketingCampaignActionCreateDto): Promise<{
    id: number;
    campaignId: number;
    actionType: string;
    payload: any;
  }> {
    const existingAction =
      await this.marketingCampaignRepository.findActionByCampaignId(
        data.campaignId,
      );

    if (existingAction) {
      throw new Error(`Action already exists for campaign ${data.campaignId}`);
    }

    return await this.marketingCampaignRepository.createAction(data);
  }
}
