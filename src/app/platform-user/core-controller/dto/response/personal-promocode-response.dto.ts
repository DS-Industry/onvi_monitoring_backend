import { DiscountType } from '@loyalty/marketing-campaign/domain/enums/discount-type.enum';

export class PersonalPromocodeResponseDto {
  id: number;
  campaignId: number | null;
  code: string;
  promocodeType: string;
  personalUserId: number | null;
  discountType: DiscountType | null;
  discountValue: number | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUsage: number | null;
  maxUsagePerUser: number;
  currentUsage: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdByManagerId: number | null;
  createdReason: string | null;
  organizationId: number | null;
  posId: number | null;
  placementId: number | null;
  createdAt: string;
  updatedAt: string;
  personalUser: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  } | null;
}
