import { Module } from '@nestjs/common';
import { LoyaltyCoreModule } from '@loyalty/loyalty-core.module';
import { PrismaModule } from '@db/prisma/prisma.module';
import { JwtModule } from '@libs/auth/module';
import { DateModule } from '@libs/date/module';
import { SmsModule } from '@libs/sms/module';
import { OtpModule } from '@mobile-user/otp/otp.module';

import { SendOtpUseCase } from './use-cases/send-otp';
import { ValidateClientForLocalStrategyUseCase } from './use-cases/validate-client-for-local-strategy';
import { AuthenticateClientUseCase } from './use-cases/authenticate-client';
import { RegisterClientUseCase } from './use-cases/register-client';
import { ValidateClientForJwtStrategyUseCase } from './use-cases/validate-client-for-jwt-strategy';
import { RefreshTokensUseCase } from './use-cases/refresh-tokens';
import { ValidateRefreshTokenForJwtStrategyUseCase } from './use-cases/validate-refresh-token-for-jwt-strategy';

import { ClientAuthRepositoryProvider } from './providers/client-auth-repository.provider';
import { OtpServiceProvider } from './providers/otp-service.provider';
import { TokenServiceProvider } from './providers/token-service.provider';

import { PrismaClientAuthRepository } from './repositories/prisma-client-auth.repository';
import { RedisOtpService } from './services/redis-otp.service';
import { JwtTokenService } from './services/jwt-token.service';

const useCases = [
  SendOtpUseCase,
  ValidateClientForLocalStrategyUseCase,
  AuthenticateClientUseCase,
  RegisterClientUseCase,
  ValidateClientForJwtStrategyUseCase,
  RefreshTokensUseCase,
  ValidateRefreshTokenForJwtStrategyUseCase,
];

const repositories = [
  PrismaClientAuthRepository,
];

const services = [
  RedisOtpService,
  JwtTokenService,
];

const providers = [
  ClientAuthRepositoryProvider,
  OtpServiceProvider,
  TokenServiceProvider,
];

@Module({
  imports: [
    LoyaltyCoreModule,
    PrismaModule,
    JwtModule,
    DateModule,
    SmsModule,
    OtpModule,
  ],
  providers: [
    ...repositories,
    ...services,
    ...providers,
    ...useCases,
  ],
  exports: [...useCases],
})
export class MobileAuthCoreModule {}
