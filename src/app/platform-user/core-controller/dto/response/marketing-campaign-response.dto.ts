import { MarketingCampaignActionType } from '@prisma/client';
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
  posCount: number;
  posIds: number[];
  createdAt: string;
  updatedAt: string;
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
}
