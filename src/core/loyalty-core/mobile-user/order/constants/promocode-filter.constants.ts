export const PROMOCODE_FILTER = {
  ALL: 'all',
  PERSONAL: 'personal',
  MARKETING_CAMPAIGNS: 'marketing-campaigns',
} as const;

export type PromocodeFilterType =
  (typeof PROMOCODE_FILTER)[keyof typeof PROMOCODE_FILTER];

export const VALID_PROMOCODE_FILTERS: PromocodeFilterType[] = [
  PROMOCODE_FILTER.ALL,
  PROMOCODE_FILTER.PERSONAL,
  PROMOCODE_FILTER.MARKETING_CAMPAIGNS,
];
