export class LoyaltyTierUpdateInfoResponseDto {
  cardId: number;
  currentTierId: number;
  spentSum: number;
  nextTierId: number;
  actionTier: TierUpdateAction;
}

export enum TierUpdateAction {
  UPGRADE = 'UPGRADE',
  DOWNGRADE = 'DOWNGRADE',
  NO_CHANGE = 'NO_CHANGE',
}
