import { Module } from '@nestjs/common';
import { BcryptModule } from '@libs/bcrypt/module';
import { AuthController } from '@platform-admin/auth/controller/auth.controller';
import { SignRefreshTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-refresh-token';
import { JwtModule } from '@libs/auth/module';
import { LoginAuthUseCase } from '@platform-admin/auth/use-cases/auth-login';
import { SignAccessTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-access-token';
import { SetRefreshTokenUseCase } from '@platform-admin/auth/use-cases/auth-set-refresh-token';
import { AdminModule } from '@platform-admin/admin/admin.module';
import { LocalStrategy } from '@platform-admin/auth/strategies/local.strategy';
import { JwtStrategy } from '@platform-admin/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@platform-admin/auth/strategies/jwt-refresh.strategy';
import { ValidateUserForLocalStrategyUseCase } from '@platform-admin/auth/use-cases/auth-validate-local-strategy';
import { ValidateUserForJwtStrategyUseCase } from '@platform-admin/auth/use-cases/auth-validate-jwt-strategy';
import { GetAccountIfRefreshTokenMatchesUseCase } from '@platform-admin/auth/use-cases/auth-get-account-refresh-token';

@Module({
  imports: [BcryptModule, JwtModule, AdminModule],
  controllers: [AuthController],
  providers: [
    SignRefreshTokenUseCase,
    LoginAuthUseCase,
    SignAccessTokenUseCase,
    SetRefreshTokenUseCase,
    ValidateUserForLocalStrategyUseCase,
    ValidateUserForJwtStrategyUseCase,
    GetAccountIfRefreshTokenMatchesUseCase,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [SignRefreshTokenUseCase],
})
export class AdminAuthModule {}
