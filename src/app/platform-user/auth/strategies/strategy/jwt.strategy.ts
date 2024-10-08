import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@platform-user/auth/domain/jwt-payload';
import { User } from '@platform-user/user/domain/user';
import { ValidateUserForJwtStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-jwt-strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'userJwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateJwtStrategyUseCase: ValidateUserForJwtStrategyUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    try {
      return await this.validateJwtStrategyUseCase.execute(payload.email);
    } catch (e) {
      throw new Error('error');
    }
  }
}
