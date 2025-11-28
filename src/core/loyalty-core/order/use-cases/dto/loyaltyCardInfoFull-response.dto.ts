import { LTYBenefitType, StatusUser } from '@prisma/client';

export class LoyaltyCardInfoFullResponseDto {
  cardId: number;
  balance: number;
  devNumber: string;
  monthlyLimit?: number;
  status: StatusUser;
  benefits: {
    bonus: number;
    benefitType: LTYBenefitType;
  }[];
  loyaltyProgram?: {
    organizations: {
      id: number;
    }[];
  };
}
