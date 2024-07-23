import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('userLocal') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new Error(err);
    }
    return user;
  }
}
