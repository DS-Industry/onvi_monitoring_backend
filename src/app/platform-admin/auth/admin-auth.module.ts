import { Module } from '@nestjs/common';
import { BcryptModule } from '@libs/bcrypt/module';
import { AuthController } from '@platform-admin/auth/controller/auth.controller';
import { SignRefreshTokenUseCase } from '@platform-admin/auth/use-cases/sign-refresh-token';
import { JwtModule } from '@libs/auth/module';

@Module({
  imports: [BcryptModule, JwtModule],
  controllers: [AuthController],
  providers: [SignRefreshTokenUseCase],
  exports: [SignRefreshTokenUseCase],
})
export class AdminAuthModule {}
