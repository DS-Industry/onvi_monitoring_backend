import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@mobile-core/auth/domain/token-pair';
import { ValidateRefreshTokenForJwtStrategyUseCase } from '@mobile-core/auth/use-cases/validate-refresh-token-for-jwt-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'client-jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateRefreshTokenUseCase: ValidateRefreshTokenForJwtStrategyUseCase,
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
      const result = await this.validateRefreshTokenUseCase.execute({
        refreshToken,
        phone: payload.phone,
      });

      return {
        client: result.client,
        refreshToken: result.refreshToken,
      };
    } catch (e) {
      throw new Error('error');
    }
  }
}
