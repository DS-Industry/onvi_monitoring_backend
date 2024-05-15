import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@mobile-user/auth/domain/jwt-payload';
import { GetClientIfRefreshTokenMatchesUseCase } from '@mobile-user/auth/use-cases/auth-get-account-refresh-token';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'client-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getAccountUseCase: GetClientIfRefreshTokenMatchesUseCase,
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
      return await this.getAccountUseCase.execute(refreshToken, payload.phone);
    } catch (e) {
      throw new Error('error');
    }
  }
}
