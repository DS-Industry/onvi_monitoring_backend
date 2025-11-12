export interface TransactionDataPoint {
  date: string;
  accruals: number;
  debits: number;
}

export class LoyaltyProgramTransactionAnalyticsResponseDto {
  data: TransactionDataPoint[];
  totalAccruals: number;
  totalDebits: number;
  period: string;
}
