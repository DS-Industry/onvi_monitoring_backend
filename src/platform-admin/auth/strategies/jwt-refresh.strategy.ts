import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../model/TokenPayload';
import { PlatformAdminUseCase } from '../../../core/modules/platform-admin/useCases/platformAdmin.useCase';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly platformAdminUseCase: PlatformAdminUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwtRefreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    try {
      const refreshToken = request.body['refreshToken'];
      return await this.platformAdminUseCase.getAccountIfRefreshTokenMatches(
        refreshToken,
        payload.phone,
      );
    } catch (e) {
      throw new Error('error');
    }
  }
}
