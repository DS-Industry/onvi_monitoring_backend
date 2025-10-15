import { Module } from '@nestjs/common';
import { Auth } from '@mobile-user/auth/controller/auth';
import { LocalStrategy } from '@mobile-user/auth/strategies/local.strategy';
import { JwtStrategy } from '@mobile-user/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@mobile-user/auth/strategies/jwt-refresh.strategy';
import { MobileAuthCoreModule } from '@mobile-core/auth/mobile-auth-core.module';

@Module({
  imports: [MobileAuthCoreModule],
  controllers: [Auth],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [],
})
export class ClientAuthModule {}
