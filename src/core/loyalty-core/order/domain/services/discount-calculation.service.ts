import { Injectable } from '@nestjs/common';
import { DiscountType } from '@loyalty/marketing-campaign/domain/enums/discount-type.enum';
import { ActiveActivationWindow } from '@loyalty/mobile-user/order/interface/activation-window-repository.interface';

export interface DiscountCalculationResult {
  discountAmount: number;
  activationWindowId: number;
}

export interface CalculateDiscountRequest {
  originalSum: number;
  rewardPointsUsed: number;
  discountWindows: ActiveActivationWindow[];
}

@Injectable()
export class DiscountCalculationService {
  calculateBestDiscount(
    request: CalculateDiscountRequest,
  ): DiscountCalculationResult | null {
    const { originalSum, rewardPointsUsed, discountWindows } = request;

    if (discountWindows.length === 0) {
      return null;
    }

    const discountCalculations = discountWindows.map((window) => {
      const payload = window.payload as {
        discountType: DiscountType;
        discountValue: number;
        maxDiscountAmount?: number;
      };

      let discountAmount = 0;

      if (payload.discountType === DiscountType.FIXED_AMOUNT) {
        discountAmount = Math.min(
          payload.discountValue,
          originalSum - rewardPointsUsed,
        );
      } else if (payload.discountType === DiscountType.PERCENTAGE) {
        const percentageDiscount =
          (payload.discountValue / 100) * originalSum;
        const maxDiscount = payload.maxDiscountAmount || originalSum;
        discountAmount = Math.min(
          percentageDiscount,
          maxDiscount,
          originalSum - rewardPointsUsed,
        );
      } else if (payload.discountType === DiscountType.FREE_SERVICE) {
        discountAmount = originalSum - rewardPointsUsed;
      }

      return {
        discountAmount,
        activationWindowId: window.id,
      };
    });

    const bestDiscount = discountCalculations.reduce(
      (best, current) => {
        return current.discountAmount > best.discountAmount ? current : best;
      },
      discountCalculations[0],
    );

    return bestDiscount.discountAmount > 0 ? bestDiscount : null;
  }
}

