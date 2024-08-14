// src/app/device/auth/guards/api-key.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApiKeyAuthGuard
  extends AuthGuard('api-key')
  implements CanActivate
{
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, context: ExecutionContext) {
    if (err || !user) {
      throw new Error(err) || new UnauthorizedException('Unauthorized access');
    }
    return user;
  }
}
