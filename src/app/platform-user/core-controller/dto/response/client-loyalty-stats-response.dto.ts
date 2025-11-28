export class ClientLoyaltyStatsResponseDto {
  clientId: number;
  organizationId: number;
  organizationName: string;
  clientName: string;

  totalPurchaseAmount: number;
  accumulatedAmount: number;
  amountToNextTier: number;

  activeBonuses: number;
  totalBonusEarned: number;

  cardNumber: string;
  cardDevNumber: string;

  currentTierName?: string;
  currentTierId?: number;
  currentTierDescription?: string;

  nextTierName?: string;
  nextTierId?: number;
  nextTierDescription?: string;

  isHighestTier: boolean;
  tierProgressPercentage?: number;
}
