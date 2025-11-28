import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class PhoneMismatchExceptions extends BaseException {
  constructor(oldCardPhone: string, currentPhone: string) {
    super(
      'api_card',
      400,
      `Phone numbers do not match. Old card phone: ${oldCardPhone}, current phone: ${currentPhone}`,
    );
  }

  getHttpStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }
}
