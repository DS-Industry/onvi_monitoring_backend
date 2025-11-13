import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import {
  LTYProgram,
  BonusBurnoutType,
} from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export interface BonusRedemptionRulesDto {
  loyaltyProgramId: number;
  burnoutType: BonusBurnoutType;
  lifetimeBonusDays?: number;
  maxRedeemPercentage: number;
  hasBonusWithSale: boolean;
}

@Injectable()
export class UpdateBonusRedemptionRulesUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(
    input: BonusRedemptionRulesDto,
    oldLoyaltyProgram: LTYProgram,
  ): Promise<LTYProgram> {
    const {
      burnoutType,
      lifetimeBonusDays,
      maxRedeemPercentage,
      hasBonusWithSale,
    } = input;

    // Update bonus burnout settings
    oldLoyaltyProgram.burnoutType = burnoutType;
    oldLoyaltyProgram.lifetimeBonusDays = lifetimeBonusDays || null;
    oldLoyaltyProgram.maxRedeemPercentage = maxRedeemPercentage;
    oldLoyaltyProgram.hasBonusWithSale = hasBonusWithSale;

    return await this.loyaltyProgramRepository.update(oldLoyaltyProgram);
  }
}
