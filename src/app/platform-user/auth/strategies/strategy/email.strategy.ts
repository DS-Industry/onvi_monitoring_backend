import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserEmailStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-email-strategy';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, 'userEmail') {
  constructor(
    private readonly validateUserEmailStrategyUseCase: ValidateUserEmailStrategyUseCase,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'confirmString',
    });
  }

  async validate(
    email: string,
    confirmString: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    try {
      const user: User = await this.validateUserEmailStrategyUseCase.execute(
        email,
        confirmString,
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
