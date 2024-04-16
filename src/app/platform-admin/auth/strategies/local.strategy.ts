import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PlatformAdmin } from '../../../../core/modules/platform-admin/domain/PlatformAdmin';
import { ValidateUserForLocalStrategyUseCase } from '@platform-admin/auth/use-cases/validate-local-strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateLocalStrategyUseCase: ValidateUserForLocalStrategyUseCase,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
    done: (error: Error, data) => Record<string, unknown>,
  ) {
    try {
      const platformAdmin: PlatformAdmin =
        await this.validateLocalStrategyUseCase.execute(email, password);
      if (!platformAdmin) {
        return done(null, { register: true });
      }

      return done(null, platformAdmin);
    } catch (e) {
      throw new Error('error');
    }
  }
}
