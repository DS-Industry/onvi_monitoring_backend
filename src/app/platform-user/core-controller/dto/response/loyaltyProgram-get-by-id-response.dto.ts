import { BonusBurnoutType } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { LTYProgramStatus } from '@prisma/client';

export class LoyaltyProgramGetByIdResponseDto {
  id: number;
  name: string;
  status: LTYProgramStatus;
  startDate: Date;
  isHub: boolean;
  isHubRequested: boolean;
  isHubRejected: boolean;
  description?: string;
  organizations: {
    id: number;
    name: string;
  }[];
  lifetimeDays?: number;
  maxLevels: number;
  burnoutType?: BonusBurnoutType;
  lifetimeBonusDays?: number;
  maxRedeemPercentage?: number;
  hasBonusWithSale?: boolean;
}
