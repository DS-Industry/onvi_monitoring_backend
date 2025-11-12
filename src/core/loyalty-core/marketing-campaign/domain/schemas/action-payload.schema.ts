import { z } from 'zod';
import { DiscountType } from '../enums/discount-type.enum';
import { MarketingCampaignActionType } from '@prisma/client';

const discountPayloadSchema = z.object({
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().min(0, { message: 'Discount value must be >= 0' }),
  maxDiscountAmount: z.number().min(0).optional(),
  activationWindow: z
    .object({
      durationDays: z.number().int().min(1).optional(),
    })
    .optional(),
});

const cashbackBoostPayloadSchema = z.object({
  multiplier: z
    .number()
    .min(0, { message: 'Multiplier must be >= 0' })
    .optional(),
  percentage: z
    .number()
    .min(0)
    .max(100, { message: 'Percentage must be between 0 and 100' })
    .optional(),
  activationWindow: z
    .object({
      durationDays: z.number().int().min(1).optional(),
    })
    .optional(),
});

const giftPointsPayloadSchema = z.object({
  points: z.number().int().min(0, { message: 'Points must be >= 0' }),
  activationWindow: z
    .object({
      durationDays: z.number().int().min(1).optional(),
    })
    .optional(),
});

const promocodeIssuePayloadSchema = z.object({
  activationWindow: z
    .object({
      durationDays: z.number().int().min(1).optional(),
    })
    .optional(),
});

const tierUpgradePayloadSchema = z.object({
  targetTierId: z
    .number()
    .int()
    .min(1, { message: 'Target tier ID must be >= 1' })
    .optional(),
  activationWindow: z
    .object({
      durationDays: z.number().int().min(1).optional(),
    })
    .optional(),
});

export const marketingCampaignActionPayloadSchema = z.discriminatedUnion(
  'actionType',
  [
    z.object({
      actionType: z.literal(MarketingCampaignActionType.DISCOUNT),
      payload: discountPayloadSchema,
    }),
    z.object({
      actionType: z.literal(MarketingCampaignActionType.CASHBACK_BOOST),
      payload: cashbackBoostPayloadSchema,
    }),
    z.object({
      actionType: z.literal(MarketingCampaignActionType.GIFT_POINTS),
      payload: giftPointsPayloadSchema,
    }),
    z.object({
      actionType: z.literal(MarketingCampaignActionType.PROMOCODE_ISSUE),
      payload: promocodeIssuePayloadSchema,
    }),
    z.object({
      actionType: z.literal(MarketingCampaignActionType.TIER_UPGRADE),
      payload: tierUpgradePayloadSchema,
    }),
  ],
);

export const actionPayloadSchemas = {
  [MarketingCampaignActionType.DISCOUNT]: discountPayloadSchema,
  [MarketingCampaignActionType.CASHBACK_BOOST]: cashbackBoostPayloadSchema,
  [MarketingCampaignActionType.GIFT_POINTS]: giftPointsPayloadSchema,
  [MarketingCampaignActionType.PROMOCODE_ISSUE]: promocodeIssuePayloadSchema,
  [MarketingCampaignActionType.TIER_UPGRADE]: tierUpgradePayloadSchema,
};

export function getEmptyPayloadForActionType(): Record<string, any> {
  return {};
}

export type DiscountPayload = z.infer<typeof discountPayloadSchema>;
export type CashbackBoostPayload = z.infer<typeof cashbackBoostPayloadSchema>;
export type GiftPointsPayload = z.infer<typeof giftPointsPayloadSchema>;
export type PromocodeIssuePayload = z.infer<typeof promocodeIssuePayloadSchema>;
export type TierUpgradePayload = z.infer<typeof tierUpgradePayloadSchema>;
export type MarketingCampaignActionPayload = z.infer<
  typeof marketingCampaignActionPayloadSchema
>;
