import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
  Weekday,
} from '../enums/condition-type.enum';

export interface BaseCondition {
  type: CampaignConditionType;
}

export interface TimeRangeCondition extends BaseCondition {
  type: CampaignConditionType.TIME_RANGE;
  start: string;
  end: string;
}

export interface WeekdayCondition extends BaseCondition {
  type: CampaignConditionType.WEEKDAY;
  values: Weekday[];
}

export interface VisitCountCondition extends BaseCondition {
  type: CampaignConditionType.VISIT_COUNT;
  operator: ConditionOperator;
  value: number;
  cycle?: VisitCycle;
}

export interface PurchaseAmountCondition extends BaseCondition {
  type: CampaignConditionType.PURCHASE_AMOUNT;
  operator: ConditionOperator;
  value: number;
}

export interface BirthdayCondition extends BaseCondition {
  type: CampaignConditionType.BIRTHDAY;
  daysBefore: number;
  daysAfter: number;
}

export interface InactivityCondition extends BaseCondition {
  type: CampaignConditionType.INACTIVITY;
  days: number;
}

export interface PromocodeEntryCondition extends BaseCondition {
  type: CampaignConditionType.PROMOCODE_ENTRY;
  code: string;
}
