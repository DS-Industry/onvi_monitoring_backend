import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CardNotFoundExceptions extends BaseException {
  constructor(clientId: number) {
    super('api_card', 404, `Card not found for client ${clientId}`);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}
