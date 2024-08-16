import { Module } from '@nestjs/common';
import { LoggerModule } from '../infra/logger/module';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './auth/strategies/api-key.strategy';

@Module({
  imports: [PassportModule, LoggerModule],
  providers: [ApiKeyStrategy],
})
export class PlatformDeviceModule {}
