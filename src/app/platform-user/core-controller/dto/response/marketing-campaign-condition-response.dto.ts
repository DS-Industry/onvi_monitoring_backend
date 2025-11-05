export enum MarketingCampaignConditionType {
  TIME_RANGE = 'TIME_RANGE',
  WEEKDAY = 'WEEKDAY',
  EVENT = 'EVENT',
  VISIT_COUNT = 'VISIT_COUNT',
  PURCHASE_AMOUNT = 'PURCHASE_AMOUNT',
  PROMOCODE_ENTRY = 'PROMOCODE_ENTRY',
}

export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class MarketingCampaignConditionResponseDto {
  id: number;
  type: MarketingCampaignConditionType;
  order: number;
  startTime?: string; 
  endTime?: string;
  weekdays?: Weekday[];
  visitCount?: number; 
  minAmount?: number; 
  maxAmount?: number; 
  promocodeId?: number;
  promocode?: { 
    id: number;
    code: string;
  };
  benefitId?: number; 
  benefit?: {
    id: number;
    name: string;
  };
}

export class MarketingCampaignConditionsResponseDto {
  campaignId: number;
  conditions: MarketingCampaignConditionResponseDto[];
}

