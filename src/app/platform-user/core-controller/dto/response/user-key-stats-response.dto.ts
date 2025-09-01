export class UserKeyStatsResponseDto {
  clientId: number;
  organizationId: number;
  organizationName: string;
  clientName: string;
  totalAmountSpent: number;
  averageOrderAmount: number;
  totalOrdersCount: number;
  cardBalance: number;
  lastOrderDate?: Date;
  firstOrderDate?: Date;
  cardNumber: string;
  cardDevNumber: string;
}
