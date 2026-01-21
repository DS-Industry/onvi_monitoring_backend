import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshGuard extends AuthGuard('client-jwt-refresh-token') {
  private readonly logger = new Logger(RefreshGuard.name);

  constructor() {
    super();
  }

  handleRequest(err: any, user: any) {
    if (!user || err) {
      const errorMessage = err?.message || 'User not found or authentication failed';
      const errorStack = err?.stack;
      this.logger.error(
        `RefreshGuard validation failed. Error: ${errorMessage}`,
        errorStack,
      );
      throw new Error(errorMessage);
    }
    this.logger.debug(`RefreshGuard validation successful for user: ${user?.client?.id || 'unknown'}`);
    return user;
  }
}
