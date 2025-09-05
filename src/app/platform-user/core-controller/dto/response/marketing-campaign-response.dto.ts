export class MarketingCampaignResponseDto {
  id: number;
  name: string;
  status: string;
  type: string;
  launchDate: string;
  endDate?: string;
  description?: string;
  ltyProgramId?: number;
  ltyProgramName?: string;
  discountType: string;
  discountValue: number;
  promocode?: string;
  maxUsage?: number;
  currentUsage: number;
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
}
