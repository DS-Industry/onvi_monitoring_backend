import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokenPayload } from '@platform-admin/auth/domain/jwt-payload';
import { GetAdminIfRefreshTokenMatchesUseCase } from '@platform-admin/auth/use-cases/auth-get-account-refresh-token';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getAccountUseCase: GetAdminIfRefreshTokenMatchesUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refreshToken,
        ExtractJwt.fromBodyField('refreshToken'),
      ]),
      secretOrKey: configService.get<string>('jwtRefreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    console.log(request);
    try {
      const refreshToken = request?.cookies?.refreshToken || request.body['refreshToken'];
      return await this.getAccountUseCase.execute(refreshToken, payload.email);
    } catch (e) {
      throw new Error('error');
    }
  }
}
