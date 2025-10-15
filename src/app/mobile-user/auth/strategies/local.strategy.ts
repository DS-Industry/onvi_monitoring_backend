import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateClientForLocalStrategyUseCase } from '@mobile-core/auth/use-cases/validate-client-for-local-strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'clientLocal') {
  constructor(
    private readonly validateLocalStrategyUseCase: ValidateClientForLocalStrategyUseCase,
  ) {
    super({
      usernameField: 'phone',
      passwordField: 'otp',
    });
  }

  async validate(
    phone: string,
    otp: string,
    done: (error: Error, data: any) => Record<string, unknown>,
  ) {
    try {
      const result = await this.validateLocalStrategyUseCase.execute(phone, otp);

      if ('register' in result) {
        return done(null, { register: true });
      }

      return done(null, result);
    } catch (e) {
      throw new Error(e);
    }
  }
}
