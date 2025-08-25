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
  nextTierName?: string;
  currentTierId?: number;
  nextTierId?: number;
}
