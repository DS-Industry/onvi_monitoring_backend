import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class CardNotMatchExceptions extends BaseException {
  constructor(devNumber: string) {
    super('api_card', 404, `Card with devNumber ${devNumber} not found`);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}

