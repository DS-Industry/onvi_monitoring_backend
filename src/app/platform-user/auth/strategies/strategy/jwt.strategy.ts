import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '@platform-user/auth/domain/jwt-payload';
import { User } from '@platform-user/user/domain/user';
import { ValidateUserForJwtStrategyUseCase } from '@platform-user/auth/strategies/validate/auth-validate-jwt-strategy';
import { UserException } from '@exception/option.exceptions';
import { USER_AUTHORIZATION_EXCEPTION_CODE } from '@constant/error.constants';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'userJwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly validateJwtStrategyUseCase: ValidateUserForJwtStrategyUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      secretOrKey: configService.get<string>('jwtSecret'),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    try {
      return await this.validateJwtStrategyUseCase.execute(payload.email);
    } catch (e) {
      throw new UserException(
        USER_AUTHORIZATION_EXCEPTION_CODE,
        'Unauthorized',
      );
    }
  }
}
