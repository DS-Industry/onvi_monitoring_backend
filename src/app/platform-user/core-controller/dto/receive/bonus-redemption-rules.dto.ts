import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { BonusBurnoutType } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';

export class BonusRedemptionRulesDto {
  @IsNumber()
  @IsNotEmpty({ message: 'loyaltyProgramId is required' })
  loyaltyProgramId: number;

  @IsEnum(['year', 'month', 'custom', 'never'])
  @IsNotEmpty({ message: 'burnoutType is required' })
  burnoutType: BonusBurnoutType;

  @IsNumber()
  @Min(1, { message: 'lifetimeBonusDays must be at least 1' })
  @ValidateIf((o) => o.burnoutType === 'custom')
  @IsNotEmpty({ message: 'lifetimeBonusDays is required when burnoutType is custom' })
  lifetimeBonusDays?: number;

  @IsNumber()
  @Min(0, { message: 'maxRedeemPercentage must be at least 0' })
  @Max(100, { message: 'maxRedeemPercentage must be at most 100' })
  @IsNotEmpty({ message: 'maxRedeemPercentage is required' })
  maxRedeemPercentage: number;

  @IsBoolean()
  @IsNotEmpty({ message: 'hasBonusWithSale is required' })
  hasBonusWithSale: boolean;
}
