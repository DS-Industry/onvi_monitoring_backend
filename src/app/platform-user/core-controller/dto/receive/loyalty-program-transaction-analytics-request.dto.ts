export class LoyaltyProgramTransactionAnalyticsRequestDto {
  loyaltyProgramId: number;
  startDate?: string;
  endDate?: string;
  period?: 'lastMonth' | 'lastWeek' | 'lastYear' | 'custom';
}
