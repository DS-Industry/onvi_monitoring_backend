import { BaseException } from '@infra/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AccountNotFoundExceptions extends BaseException {
  constructor(phone: string) {
    super('api_account', 404, `Account with phone ${phone} not found`);
  }

  getHttpStatus(): number {
    return HttpStatus.NOT_FOUND;
  }
}
