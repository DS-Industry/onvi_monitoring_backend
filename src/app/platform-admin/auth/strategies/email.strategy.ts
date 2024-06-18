import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateAdminEmailStrategyUseCase } from '@platform-admin/auth/use-cases/auth-validate-email-strategy';
import { Admin } from '@platform-admin/admin/domain/admin';

@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, 'adminEmail') {
  constructor(
    private readonly validateAdminEmailStrategyUseCase: ValidateAdminEmailStrategyUseCase,
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
      const admin: Admin = await this.validateAdminEmailStrategyUseCase.execute(
        email,
        confirmString,
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
