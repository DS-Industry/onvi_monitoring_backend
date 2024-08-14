import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './auth/strategies/api-key.strategy';

@Module({
  imports: [PassportModule],
  providers: [ApiKeyStrategy],
})
export class PlatformDeviceModule {}
