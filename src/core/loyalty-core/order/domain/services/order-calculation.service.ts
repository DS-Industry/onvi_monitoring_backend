import { Injectable } from '@nestjs/common';
import { DiscountResult } from './order-discount.service';

export interface OrderTotals {
  sumDiscount: number;
  sumBonus: number;
  sumReal: number;
  sumCashback: number;
}

@Injectable()
export class OrderCalculationService {
  calculateOrderTotals(
    sumFull: number,
    discountResult: DiscountResult,
    rewardPointsUsed: number,
    initialCashback: number,
  ): OrderTotals {
    const sumDiscount = discountResult.finalDiscount;
    const sumBonus = rewardPointsUsed || 0;

    const sumReal = Math.max(
      0,
      sumFull - discountResult.finalDiscount - (rewardPointsUsed || 0),
    );

    const finalSumReal = sumReal > 0 ? sumReal : 1;

    const sumCashback =
      rewardPointsUsed && rewardPointsUsed > 0 ? 0 : initialCashback;

    return {
      sumDiscount,
      sumBonus,
      sumReal: finalSumReal,
      sumCashback,
    };
  }
}
