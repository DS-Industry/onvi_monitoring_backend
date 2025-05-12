import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserException } from '@exception/option.exceptions';
import { USER_AUTHORIZATION_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class EmailGuard extends AuthGuard('userEmail') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UserException(
        USER_AUTHORIZATION_EXCEPTION_CODE,
        'Unauthorized',
      );
    }
    return user;
  }
}
