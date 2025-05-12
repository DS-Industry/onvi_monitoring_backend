import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ValidateApiKeyStrategyUseCase } from '@platform-device/device-data-raw/use-case/auth-validate-api-key-strategy';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'apiKey') {
  constructor(
    private readonly validateApiKeyStrategyUseCase: ValidateApiKeyStrategyUseCase,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  async validate(
    apiKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    try {
      const deviceApiKey =
        await this.validateApiKeyStrategyUseCase.execute(apiKey);
      return done(null, deviceApiKey);
    } catch (error) {
      done(new UnauthorizedException('Unauthorized'), null);
    }
  }
}
