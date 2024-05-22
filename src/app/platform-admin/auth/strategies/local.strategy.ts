import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { ValidateAdminForLocalStrategyUseCase } from '@platform-admin/auth/use-cases/auth-validate-local-strategy';
import { Admin } from '@platform-admin/admin/domain/admin';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'adminLocal') {
  constructor(
    private readonly validateLocalStrategyUseCase: ValidateAdminForLocalStrategyUseCase,
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
      const admin: Admin = await this.validateLocalStrategyUseCase.execute(
        email,
        password,
      );
      if (!admin) {
        return done(null, { register: true });
      }

      return done(null, admin);
    } catch (e) {
      throw new Error(e);
    }
  }
}
