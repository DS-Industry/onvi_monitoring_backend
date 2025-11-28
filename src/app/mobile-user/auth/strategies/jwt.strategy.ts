import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@mobile-core/auth/domain/token-pair';
import { ValidateClientForJwtStrategyUseCase } from '@mobile-core/auth/use-cases/validate-client-for-jwt-strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'clientJwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateJwtStrategyUseCase: ValidateClientForJwtStrategyUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<any> {
    try {
      return await this.validateJwtStrategyUseCase.execute(payload.phone);
    } catch (e) {
      throw new Error('error');
    }
  }
}
