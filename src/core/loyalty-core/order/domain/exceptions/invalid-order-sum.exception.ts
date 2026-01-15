import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidOrderSumException extends BaseException {
  constructor(sum: number) {
    super(
      'api_order',
      400,
      `Order sum must be greater than zero. Provided: ${sum}`,
      { sum },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }
}
