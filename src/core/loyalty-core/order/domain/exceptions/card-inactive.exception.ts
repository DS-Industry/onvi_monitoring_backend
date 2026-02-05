import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CardInactiveException extends BaseException {
  constructor(clientId: number) {
    super(
      'api_order',
      403,
      `Card is inactive. User ${clientId} cannot create an order.`,
      { clientId },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.FORBIDDEN;
  }
}
