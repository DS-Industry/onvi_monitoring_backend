import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PlatformAdmin } from '../../../../core/modules/platform-admin/domain/PlatformAdmin';
import { PlatformAdminUseCase } from '../../../../core/modules/platform-admin/useCases/platformAdmin.useCase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly platformAdminUseCase: PlatformAdminUseCase) {
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
        await this.platformAdminUseCase.validateUserForLocalStrategy(
          email,
          password,
        );
      if (!platformAdmin) {
        return done(null, { register: true });
      }

      return done(null, platformAdmin);
    } catch (e) {
      throw new Error('error');
    }
  }
}
