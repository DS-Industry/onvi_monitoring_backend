import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard('user-jwt-refresh-token') {
  constructor() {
    super();
  }
}
