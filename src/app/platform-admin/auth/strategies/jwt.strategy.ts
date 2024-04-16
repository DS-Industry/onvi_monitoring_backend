import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PlatformAdmin } from '../../../../core/modules/platform-admin/domain/PlatformAdmin';
import { TokenPayload } from '@platform-admin/auth/domain/jwt-payload';
import { ValidateUserForJwtStrategyUseCase } from '@platform-admin/auth/use-cases/validate-jwt-strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateJwtStrategyUseCase: ValidateUserForJwtStrategyUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<PlatformAdmin> {
    try {
      return await this.validateJwtStrategyUseCase.execute(payload.email);
    } catch (e) {
      throw new Error('error');
    }
  }
}
