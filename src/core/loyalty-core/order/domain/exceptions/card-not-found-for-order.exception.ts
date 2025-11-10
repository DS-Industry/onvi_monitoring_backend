import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CardNotFoundForOrderException extends BaseException {
  constructor(clientId: number) {
    super(
      'api_order',
      404,
      `Card not found for client ${clientId}`,
      { clientId },
    );
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}



