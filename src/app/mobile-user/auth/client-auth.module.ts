import { Module } from '@nestjs/common';
import { BcryptModule } from '@libs/bcrypt/module';
import { JwtModule } from '@libs/auth/module';
import { ClientModule } from '@mobile-user/client/client.module';
import { Auth } from '@mobile-user/auth/controller/auth';
import { LocalStrategy } from '@mobile-user/auth/strategies/local.strategy';
import { JwtStrategy } from '@mobile-user/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '@mobile-user/auth/strategies/jwt-refresh.strategy';
import { GetClientIfRefreshTokenMatchesUseCase } from '@mobile-user/auth/use-cases/auth-get-account-refresh-token';
import { LoginAuthUseCase } from '@mobile-user/auth/use-cases/auth-login';
import { RegisterAuthUseCase } from '@mobile-user/auth/use-cases/auth-register';
import { SendOtpAuthUseCase } from '@mobile-user/auth/use-cases/auth-send-otp';
import { SetRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-set-refresh-token';
import { SignAccessTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-access-token';
import { SignRefreshTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-refresh-token';
import { ValidateClientForLocalStrategyUseCase } from '@mobile-user/auth/use-cases/auth-validate-local-strategy';
import { ValidateClientForJwtStrategyUseCase } from '@mobile-user/auth/use-cases/auth-validate-jwt-strategy';
import { OtpModule } from '@mobile-user/otp/otp.module';
import { DateModule } from '@libs/date/module';
import { SmsModule } from '@libs/sms/module';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';

@Module({
  imports: [
    BcryptModule,
    JwtModule,
    ClientModule,
    LoyaltyCoreModule,
    OtpModule,
    DateModule,
    SmsModule,
  ],
  controllers: [Auth],
  providers: [
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GetClientIfRefreshTokenMatchesUseCase,
    LoginAuthUseCase,
    RegisterAuthUseCase,
    SendOtpAuthUseCase,
    SetRefreshTokenUseCase,
    SignAccessTokenUseCase,
    SignRefreshTokenUseCase,
    ValidateClientForLocalStrategyUseCase,
    ValidateClientForJwtStrategyUseCase,
  ],
  exports: [],
})
export class ClientAuthModule {}
