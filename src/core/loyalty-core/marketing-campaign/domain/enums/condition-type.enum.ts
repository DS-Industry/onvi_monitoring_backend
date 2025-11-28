export enum CampaignConditionType {
  // Time-based conditions
  TIME_RANGE = 'TIME_RANGE',
  WEEKDAY = 'WEEKDAY',

  // User behavior conditions
  VISIT_COUNT = 'VISIT_COUNT',
  PURCHASE_AMOUNT = 'PURCHASE_AMOUNT',
  BIRTHDAY = 'BIRTHDAY',
  INACTIVITY = 'INACTIVITY',

  // Transaction-based conditions
  PROMOCODE_ENTRY = 'PROMOCODE_ENTRY',
}

export enum ConditionOperator {
  EQUALS = '==',
  NOT_EQUALS = '!=',
  GREATER_THAN = '>',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN = '<',
  LESS_THAN_OR_EQUAL = '<=',
}

export enum VisitCycle {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  ALL_TIME = 'ALL_TIME',
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
