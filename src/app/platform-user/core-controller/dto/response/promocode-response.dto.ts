import { DiscountType } from '@loyalty/marketing-campaign/domain/enums/discount-type.enum';

export class PromocodeResponseDto {
  id: number;
  campaignId: number | null;
  code: string;
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
}
