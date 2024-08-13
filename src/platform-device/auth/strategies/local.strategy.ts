import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { v4 as uuidv4 } from 'uuid';

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

  public async generateAPIKey() {
    const res = uuidv4();
    return res;
  }

  public async validateKey(
    incomingApiKey: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    done(null, true);
  }
}
