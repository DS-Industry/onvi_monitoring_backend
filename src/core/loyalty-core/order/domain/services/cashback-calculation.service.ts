import { Injectable } from '@nestjs/common';

export interface CalculateCashbackRequest {
  sum: number;
  bonusPercent: number;
}

@Injectable()
export class CashbackCalculationService {
  private static readonly MIN_CASHBACK_THRESHOLD = 1;

  calculateCashback(request: CalculateCashbackRequest): number {
    const { sum, bonusPercent } = request;

    if (bonusPercent <= 0) {
      return 0;
    }

    const cashbackRaw = (sum * bonusPercent) / 100;

    if (cashbackRaw < CashbackCalculationService.MIN_CASHBACK_THRESHOLD) {
      return 0;
    }

    return Math.ceil(cashbackRaw);
  }
}

