import { MarketingCampaignActionType } from '@loyalty/marketing-campaign/domain/enums/marketing-campaign-action-type.enum';

export class MarketingCampaignActionResponseDto {
  id: number;
  campaignId: number;
  actionType: MarketingCampaignActionType;
  payload: any;
}
