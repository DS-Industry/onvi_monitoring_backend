import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor() {
    super({ header: 'apiKey', prefix: '' }, true, async (apiKey, done) =>
      this.validateKey(apiKey, done),
    );
  }
  public async validateKey(
    incomingApiKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    done(null, true);
  }
}