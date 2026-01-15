import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CardOwnershipException extends BaseException {
  constructor(cardMobileUserId: number) {
    super(
      'api_order',
      403,
      `Card with ID ${cardMobileUserId} does not belong to the authenticated user`,
      {
        cardMobileUserId,
      },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.FORBIDDEN;
  }
}
