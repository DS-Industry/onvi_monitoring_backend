import { Module } from '@nestjs/common';
import { BcryptModule } from '@libs/bcrypt/module';
import { JwtModule } from '@libs/auth/module';
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
import { UserModule } from '@platform-user/user/user.module';
import { Auth } from '@platform-user/auth/controller/auth';
import { EmailStrategy } from '@platform-user/auth/strategies/email.strategy';
import { ActivateAuthUseCase } from '@platform-user/auth/use-cases/auth-activate';
import { PasswordResetUserUseCase } from '@platform-user/auth/use-cases/auth-password-reset';
import { PasswordConfirmMailUserUseCase } from '@platform-user/auth/use-cases/auth-password-confirm';
import { ValidateUserEmailStrategyUseCase } from '@platform-user/auth/use-cases/auth-validate-email-strategy';
import { ConfirmMailUserModule } from '@platform-user/confirmMail/confirmMail.module';
import { OrganizationConfirmMailModule } from '../../../core/business-core/organization/confirmMail/confirmMail.module';
import { AuthRegisterWorkerUseCase } from "@platform-user/auth/use-cases/auth-register-worker";

@Module({
  imports: [
    BcryptModule,
    JwtModule,
    UserModule,
    ConfirmMailUserModule,
    OrganizationConfirmMailModule,
  ],
  controllers: [Auth],
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
    EmailStrategy,
    RegisterAuthUseCase,
    ActivateAuthUseCase,
    PasswordResetUserUseCase,
    PasswordConfirmMailUserUseCase,
    ValidateUserEmailStrategyUseCase,
    AuthRegisterWorkerUseCase,
  ],
  exports: [],
})
export class UserAuthModule {}
