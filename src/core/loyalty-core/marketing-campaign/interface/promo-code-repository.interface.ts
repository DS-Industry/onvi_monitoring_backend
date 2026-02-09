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
  personalUserId: number | null;
  organizationId: number | null;
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

export interface UpdatePromoCodeInput {
  campaignId?: number;
  code?: string;
  promocodeType?: string;
  personalUserId?: number | null;
  discountType?: string;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUsage?: number;
  maxUsagePerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
  createdReason?: string;
  usageRestrictions?: any;
  organizationId?: number;
  posId?: number;
  placementId?: number;
}

export enum PromocodeFilterType {
  ALL = 'all',
  PERSONAL = 'personal',
}

export interface FindPromocodesFilter {
  organizationId: number;
  filter?: PromocodeFilterType;
  page?: number;
  size?: number;
  isActive?: boolean;
  search?: string;
  personalUserId?: number;
}

export interface PersonalPromocodeWithUser {
  id: number;
  campaignId: number | null;
  code: string;
  promocodeType: string;
  personalUserId: number | null;
  discountType: string | null;
  discountValue: number | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUsage: number | null;
  maxUsagePerUser: number;
  currentUsage: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
  createdByManagerId: number | null;
  createdReason: string | null;
  organizationId: number | null;
  posId: number | null;
  placementId: number | null;
  createdAt: Date;
  updatedAt: Date;
  personalUser: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  } | null;
}

export interface PersonalPromocodesPaginatedResult {
  data: PersonalPromocodeWithUser[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export abstract class IPromoCodeRepository {
  abstract findById(id: number): Promise<PromoCode | null>;
  abstract findByCode(code: string): Promise<PromoCode | null>;
  abstract create(input: CreatePromoCodeInput): Promise<PromoCode>;
  abstract update(id: number, input: UpdatePromoCodeInput): Promise<PromoCode>;
  abstract delete(id: number): Promise<void>;
  abstract incrementUsage(id: number): Promise<void>;
  abstract countUsageByUser(
    promocodeId: number,
    userId: number,
  ): Promise<number>;
  abstract createUsage(input: CreateMarketingCampaignUsageInput): Promise<void>;
  abstract findUsageByOrderId(orderId: number): Promise<MarketingCampaignUsage | null>;
  abstract findDiscountUsageByOrderId(
    orderId: number,
  ): Promise<MarketingCampaignUsage | null>;
  abstract findAllPromocodesPaginated(
    filter: FindPromocodesFilter,
  ): Promise<PersonalPromocodesPaginatedResult>;
}
