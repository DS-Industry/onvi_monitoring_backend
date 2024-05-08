import { Module } from '@nestjs/common';
import { BcryptModule } from '@libs/bcrypt/module';
import { JwtModule } from '@libs/auth/module';
import { UserController } from '@platform-user/user/controller/user';
import { SignRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-refresh-token';
import { LoginAuthUseCase } from '@platform-user/auth/use-cases/auth-login';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { SetRefreshTokenUseCase } from '@platform-user/auth/use-cases/auth-set-refresh-token';
import { ValidateUserForLocalStrategyUseCase } from '@platform-user/auth/use-cases/auth-validate-local-strategy';
import { ValidateUserForJwtStrategyUseCase } from '@platform-user/auth/use-cases/auth-validate-jwt-strategy';
import { GetUserIfRefreshTokenMatchesUseCase } from '@platform-user/auth/use-cases/auth-get-account-refresh-token';
import { LocalStrategy } from '@platform-user/auth/strategies/local.strategy';
import { JwtStrategy } from '@platform-user/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@platform-user/auth/strategies/jwt-refresh.strategy';
import { RegisterAuthUseCase } from '@platform-user/auth/use-cases/auth-register';
import { UserModule } from "@platform-user/user/user.module";

@Module({
  imports: [BcryptModule, JwtModule, UserModule],
  controllers: [UserController],
  providers: [
    SignRefreshTokenUseCase,
    LoginAuthUseCase,
    SignAccessTokenUseCase,
    SetRefreshTokenUseCase,
    ValidateUserForLocalStrategyUseCase,
    ValidateUserForJwtStrategyUseCase,
    GetUserIfRefreshTokenMatchesUseCase,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RegisterAuthUseCase,
  ],
  exports: [],
})
export class UserAuthModule {}
