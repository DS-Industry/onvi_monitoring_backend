import { z } from 'zod';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
  Weekday,
} from '../enums/condition-type.enum';

const timeRangeConditionSchema = z.object({
  type: z.literal(CampaignConditionType.TIME_RANGE),
  start: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (e.g., "09:00")',
  }),
  end: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format (e.g., "18:00")',
  }),
});

const weekdayConditionSchema = z.object({
  type: z.literal(CampaignConditionType.WEEKDAY),
  values: z
    .array(z.nativeEnum(Weekday))
    .min(1, { message: 'At least one weekday must be specified' }),
});

const visitCountConditionSchema = z.object({
  type: z.literal(CampaignConditionType.VISIT_COUNT),
  operator: z.nativeEnum(ConditionOperator),
  value: z.number().int().min(0, { message: 'Visit count must be >= 0' }),
  cycle: z.nativeEnum(VisitCycle).optional(),
});

const purchaseAmountConditionSchema = z.object({
  type: z.literal(CampaignConditionType.PURCHASE_AMOUNT),
  operator: z.nativeEnum(ConditionOperator),
  value: z.number().min(0, { message: 'Purchase amount must be >= 0' }),
});

const birthdayConditionSchema = z.object({
  type: z.literal(CampaignConditionType.BIRTHDAY),
  daysBefore: z.number().int().min(0, { message: 'daysBefore must be >= 0' }),
  daysAfter: z.number().int().min(0, { message: 'daysAfter must be >= 0' }),
});

const inactivityConditionSchema = z.object({
  type: z.literal(CampaignConditionType.INACTIVITY),
  days: z.number().int().min(1, { message: 'Inactivity days must be >= 1' }),
});

const promocodeEntryConditionSchema = z.object({
  type: z.literal(CampaignConditionType.PROMOCODE_ENTRY),
  code: z.string().min(1, { message: 'Promocode code is required' }),
});

export const campaignConditionSchema = z.discriminatedUnion('type', [
  timeRangeConditionSchema,
  weekdayConditionSchema,
  visitCountConditionSchema,
  purchaseAmountConditionSchema,
  birthdayConditionSchema,
  inactivityConditionSchema,
  promocodeEntryConditionSchema,
]);

export const campaignConditionTreeSchema = z
  .array(campaignConditionSchema)
  .min(1, { message: 'At least one condition is required' });

export type CampaignConditionTree = z.infer<typeof campaignConditionTreeSchema>;
export type CampaignCondition = z.infer<typeof campaignConditionSchema>;
