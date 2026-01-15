import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidBonusSumException extends BaseException {
  constructor(sumBonus: number, sum: number, reason: 'negative' | 'exceeds') {
    const message =
      reason === 'negative'
        ? `Bonus sum cannot be negative. Provided: ${sumBonus}`
        : `Bonus sum ${sumBonus} cannot exceed order sum ${sum}`;
    super('api_order', 400, message, { sumBonus, sum, reason });
  }

  getHttpStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }
}
