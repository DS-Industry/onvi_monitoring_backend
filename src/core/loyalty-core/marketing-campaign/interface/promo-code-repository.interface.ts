export interface PromoCode {
  id: number;
  campaignId: number | null;
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
}

export interface CreateMarketingCampaignUsageInput {
  campaignId: number;
  promocodeId: number;
  ltyUserId: number;
  posId: number;
  orderId: number;
}

export abstract class IPromoCodeRepository {
  abstract findById(id: number): Promise<PromoCode | null>;
  abstract incrementUsage(id: number): Promise<void>;
  abstract countUsageByUser(
    promocodeId: number,
    userId: number,
  ): Promise<number>;
  abstract createUsage(input: CreateMarketingCampaignUsageInput): Promise<void>;
}
