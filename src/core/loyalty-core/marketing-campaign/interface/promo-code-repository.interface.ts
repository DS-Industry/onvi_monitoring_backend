export interface PromoCode {
  id: number;
  campaignId: number | null;
  actionId: number | null;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUsage: number | null;
  maxUsagePerUser: number;
  currentUsage: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
  posId: number | null;
}

export interface MarketingCampaignUsage {
  id: number;
  campaignId: number;
  promocodeId: number | null;
  ltyUserId: number;
  orderId: number | null;
  usedAt: Date;
  type: string | null;
  actionId: number | null;
  posId: number | null;
}

export interface CreateMarketingCampaignUsageInput {
  campaignId: number;
  promocodeId: number;
  ltyUserId: number;
  posId: number;
  orderId: number;
  actionId?: number | null;
  type?: string;
}

export interface CreatePromoCodeInput {
  campaignId?: number;
  code: string;
  promocodeType: string;
  personalUserId?: number;
  discountType?: string;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUsage?: number;
  maxUsagePerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
  createdByManagerId?: number;
  createdReason?: string;
  usageRestrictions?: any;
  organizationId?: number;
  posId?: number;
  placementId?: number;
}

export abstract class IPromoCodeRepository {
  abstract findById(id: number): Promise<PromoCode | null>;
  abstract create(input: CreatePromoCodeInput): Promise<PromoCode>;
  abstract incrementUsage(id: number): Promise<void>;
  abstract countUsageByUser(
    promocodeId: number,
    userId: number,
  ): Promise<number>;
  abstract createUsage(input: CreateMarketingCampaignUsageInput): Promise<void>;
  abstract findUsageByOrderId(orderId: number): Promise<MarketingCampaignUsage | null>;
}
