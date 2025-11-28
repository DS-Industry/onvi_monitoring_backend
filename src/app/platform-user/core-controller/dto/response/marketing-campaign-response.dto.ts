import { DiscountType } from '@loyalty/marketing-campaign/domain/enums/discount-type.enum';
import { MarketingCampaignActionType } from '@loyalty/marketing-campaign/domain/enums/marketing-campaign-action-type.enum';

export class MarketingCampaignResponseDto {
  id: number;
  name: string;
  status: string;
  executionType: string;
  launchDate: string;
  endDate?: string;
  description?: string;
  ltyProgramId?: number;
  ltyProgramName?: string;
  ltyProgramHubPlus: boolean;
  posCount: number;
  posIds: number[];
  createdAt: string;
  updatedAt: string;
  activeDays?: number;
  createdBy: {
    id: number;
    name: string;
  };
  updatedBy: {
    id: number;
    name: string;
  };
  actionType: MarketingCampaignActionType | null;
  actionPayload: JSON | null;
  actionPromocode: {
    id: number;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxUsagePerUser: number;
  } | null;
}
