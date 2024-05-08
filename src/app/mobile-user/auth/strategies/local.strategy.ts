import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateClientForLocalStrategyUseCase } from '@mobile-user/auth/use-cases/auth-validate-local-strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
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
      const client = await this.validateLocalStrategyUseCase.execute(
        phone,
        otp,
      );

      if (!client) {
        return done(null, { register: true });
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
