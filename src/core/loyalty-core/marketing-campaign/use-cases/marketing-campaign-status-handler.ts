import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignStatus } from '@prisma/client';

@Injectable()
export class MarketingCampaignStatusHandlerUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(): Promise<void> {
    const now = new Date();

    await this.activateDraftCampaigns(now);

    await this.completeActiveCampaigns(now);
  }

  private async activateDraftCampaigns(now: Date): Promise<void> {
    const draftCampaigns =
      await this.marketingCampaignRepository.findDraftCampaignsToActivate(now);

    for (const campaign of draftCampaigns) {
      await this.marketingCampaignRepository.updateStatus(
        campaign.id,
        MarketingCampaignStatus.ACTIVE,
      );
      console.log(`Activated campaign: ${campaign.name} (ID: ${campaign.id})`);
    }
  }

  private async completeActiveCampaigns(now: Date): Promise<void> {
    const activeCampaigns =
      await this.marketingCampaignRepository.findActiveCampaignsToComplete(now);

    for (const campaign of activeCampaigns) {
      await this.marketingCampaignRepository.updateStatus(
        campaign.id,
        MarketingCampaignStatus.COMPLETED,
      );
      console.log(`Completed campaign: ${campaign.name} (ID: ${campaign.id})`);
    }
  }
}
