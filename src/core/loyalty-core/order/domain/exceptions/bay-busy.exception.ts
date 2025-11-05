import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class BayBusyException extends BaseException {
  constructor(bayId?: number) {
    super(
      'api_order',
      400,
      bayId ? `Bay ${bayId} is currently busy` : 'Bay is currently busy',
      { bayId },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.CONFLICT;
  }
}


