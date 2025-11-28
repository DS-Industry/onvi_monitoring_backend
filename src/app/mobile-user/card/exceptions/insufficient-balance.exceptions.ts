import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InsufficientBalanceExceptions extends BaseException {
  constructor(devNumber: string, balance: number, required: number) {
    super(
      'api_card',
      400,
      `Insufficient balance on card ${devNumber}. Current balance: ${balance}, required: ${required}`,
    );
  }

  getHttpStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }
}
