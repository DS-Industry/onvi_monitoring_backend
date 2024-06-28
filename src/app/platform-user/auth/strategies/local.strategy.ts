import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateUserForLocalStrategyUseCase } from '@platform-user/auth/use-cases/auth-validate-local-strategy';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'userLocal') {
  constructor(
    private readonly validateLocalStrategyUseCase: ValidateUserForLocalStrategyUseCase,
  ) {
    super({
      usernameField: 'email',
      otpField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    try {
      const user: User = await this.validateLocalStrategyUseCase.execute(
        email,
        password,
      );
      if (!user) {
        return done(null, { register: true });
      }

      return done(null, user);
    } catch (e) {
      throw new Error(e);
    }
  }
}
