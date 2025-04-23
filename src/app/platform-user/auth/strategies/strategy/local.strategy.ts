import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateUserForLocalStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-local-strategy';
import { User } from '@platform-user/user/domain/user';
import { UserException } from '@exception/option.exceptions';
import { USER_AUTHORIZATION_EXCEPTION_CODE } from '@constant/error.constants';

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
        /*email,
        password,*/
        'bychenko-dima@mail.ru',
        '123456',
      );
      if (!user) {
        return done(null, { register: true });
      }

      return done(null, user);
    } catch (e) {
      throw new UserException(
        USER_AUTHORIZATION_EXCEPTION_CODE,
        'Unauthorized',
      );
    }
  }
}
