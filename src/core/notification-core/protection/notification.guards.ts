import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { NotificationException } from '@exception/option.exceptions';
import { NOTIFICATION_AUTH_EXCEPTION_CODE } from '@constant/error.constants';

@Injectable()
export class NotificationGuard
  extends AuthGuard('notification')
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw (
        new Error(err) ||
        new NotificationException(
          NOTIFICATION_AUTH_EXCEPTION_CODE,
          'Unauthorized access',
        )
      );
    }
    return user;
  }
}
