import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@platform-admin/auth/domain/jwt-payload';
import { GetAccountIfRefreshTokenMatchesUseCase } from '@platform-admin/auth/use-cases/get-account-refresh-token';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getAccountUseCase: GetAccountIfRefreshTokenMatchesUseCase,
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
      return await this.getAccountUseCase.execute(refreshToken, payload.email);
    } catch (e) {
      throw new Error('error');
    }
  }
}
