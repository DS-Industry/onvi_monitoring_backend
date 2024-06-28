import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailGuard extends AuthGuard('adminEmail') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, context: ExecutionContext) {
    if (err || !user) {
      throw new Error(err);
    }
    return user;
  }
}
