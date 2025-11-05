import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InsufficientFreeVacuumException extends BaseException {
  constructor(used: number, limit: number) {
    super(
      'api_order',
      400,
      `Insufficient free vacuum remaining. Used: ${used}/${limit}`,
      { used, limit },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }
}

