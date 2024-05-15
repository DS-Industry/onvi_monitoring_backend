import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateClientForLocalStrategyUseCase } from '@mobile-user/auth/use-cases/auth-validate-local-strategy';
import { Client } from '@mobile-user/client/domain/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'clientLocal') {
  constructor(
    private readonly validateLocalStrategyUseCase: ValidateClientForLocalStrategyUseCase,
  ) {
    super({
      usernameField: 'phone',
      otpField: 'otp',
    });
  }

  async validate(
    phone: string,
    otp: string,
    done: (error: Error, data: any) => Record<string, unknown>,
  ) {
    try {
      const client: Client = await this.validateLocalStrategyUseCase.execute(
        phone,
        otp,
      );

      if (!client) {
        return done(null, { register: true });
      }

      return done(null, client);
    } catch (e) {
      throw new Error(e);
    }
  }
}
