import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@mobile-core/auth/domain/token-pair';
import { ValidateRefreshTokenForJwtStrategyUseCase } from '@mobile-core/auth/use-cases/validate-refresh-token-for-jwt-strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'client-jwt-refresh-token',
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly validateRefreshTokenUseCase: ValidateRefreshTokenForJwtStrategyUseCase,
  ) {
    const secret = configService.get<string>('jwtRefreshTokenSecret')?.trim();
    
    if (!secret) {
      throw new Error('JWT_REFRESH_TOKEN_SECRET is not configured in JwtRefreshStrategy');
    }

    
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    try {
      const refreshToken = request.body['refreshToken'];
      const secret = this.configService.get<string>('jwtRefreshTokenSecret');
      
      this.logger.debug(`Validating refresh token for phone: ${payload.phone}`);
      this.logger.debug(`Token preview: ${refreshToken ? refreshToken.substring(0, 20) + '...' : 'MISSING'}`);
      this.logger.debug(`Secret configured: ${secret ? 'YES (length: ' + secret.length + ')' : 'NO'}`);
      
      const result = await this.validateRefreshTokenUseCase.execute({
        refreshToken,
        phone: payload.phone,
      });

      this.logger.debug(`Refresh token validated successfully for client: ${result.client.id}`);
      return {
        client: result.client,
        refreshToken: result.refreshToken,
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorStack = e instanceof Error ? e.stack : undefined;
      this.logger.error(
        `Refresh token validation failed for phone: ${payload?.phone}. Error: ${errorMessage}`,
        errorStack,
      );
      throw new Error(errorMessage || 'Invalid refresh token');
    }
  }
}
