import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../model/TokenPayload';
import { PlatformAdminUseCase } from '../../../../core/modules/platform-admin/useCases/platformAdmin.useCase';
import { PlatformAdmin } from '../../../../core/modules/platform-admin/domain/PlatformAdmin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly platformAdminUseCase: PlatformAdminUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<PlatformAdmin> {
    try {
      return await this.platformAdminUseCase.validateUserForJwtStrategy(
        payload.phone,
      );
    } catch (e) {
      throw new Error('error');
    }
  }
}
